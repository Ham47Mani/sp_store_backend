import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { userTypes } from 'src/enums/users.enums';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from 'src/shared/repositories/user.repository';
import { comparePassword, generateHashPassword } from 'src/shared/utility/password.manager';
import { generateAuthToken } from 'src/shared/utility/token.management';
import { MailService } from 'src/mail/mail.service';
import { ValidateMongoID } from 'src/shared/pipes/ValidateMongoId.pipe';

@Injectable()
export class UsersService {
  constructor(
    private readonly configService: ConfigService, 
    @Inject(UserRepository) private readonly userDB: UserRepository,
    private readonly mailService: MailService
  ) {}

  //------------- Create a User --------------
  async create(createUserDto: CreateUserDto) {
    try {
      // Generate the hash password
      createUserDto.password = await generateHashPassword(createUserDto.password);

      // Check is it for admin
      if (createUserDto.type === userTypes.ADMIN && createUserDto.secretToken !== this.configService.get<string>('adminSecretToken')) {
        throw new BadRequestException('Not Allowed to create admin');
      } else if (createUserDto.type !== userTypes.CUSTOMER ) {
        createUserDto.isVerified = true;
      }

      // Check if user already exist
      const user = await this.userDB.findOne({ email: createUserDto.email });
      if (user)
        throw new BadRequestException('User already exists');

      // Generate th OTP
      const otp = Math.floor((Math.random() * 900000) + 100000);
      const otpExpiry = new Date();
      otpExpiry.setMinutes(otpExpiry.getMinutes() + 10);
      
      // Create a new user
      const newUser = await this.userDB.create({
        ...createUserDto,
        otp,
        otpExpiry
      });
      
      // Check if the user is not an admin send otp in email 
      if (newUser.type !== userTypes.ADMIN) {
        const templateVars = {
          customerEmail: newUser.email,
          customerName: newUser.name,
          otp
        }
        await this.mailService.sendEmail('verification' ,'Verify Your Email', templateVars);
      }

      return {
        success: true,
        message: newUser.type === userTypes.ADMIN ? 
          "Admin created successfully" : 
          "Please activate your account by verifying your email. We have sent you an email with OTP",
        result: {email: newUser.email}
      }
    } catch (error) {
      console.error('Error during user creation:', error);
      throw new BadRequestException('Error while creating user');
    }
  }

  //------------- Login a User --------------
  async login(loginUserDTO: LoginUserDto) {
    try {
      // check if the user exists
      const userExists = await this.userDB.findOne({email: loginUserDTO.email});
      if (!userExists) throw new NotFoundException ('User not found');
      if (!userExists.isVerified) throw new BadRequestException('Please Verifiy Your Email');

      // Check if the password matched
      const isPasswordMatch = await comparePassword(loginUserDTO.password, userExists.password);
      if (!isPasswordMatch) throw new BadRequestException('Invalid Password');

      // Generate the token
      const token = await generateAuthToken(userExists._id.toString());

      return {
        success: true,
        message: "Login Successful",
        result: {
          user: {
            name: userExists.name,
            email: userExists.email,
            type: userExists.type,
            id: userExists._id.toString()
          },
          token,
        },
        error: null
      };

    } catch (error) {
      throw error;
    }
  }

  //------------- Verify Email --------------
  async verifyEmail (otp: string, email: string) {
    try {
      // Check if user exists
      const user = await this.userDB.findOne({email});
      if (!user) throw new BadRequestException('User Not Found');

      // Check if OTP is valid
      if (user.otp !== otp) throw new BadRequestException('Invalid OTP')
      
      // Check the expire time form OTP
      if (user.otpExpiry < new Date()) throw new Error('OTP Expired');

      // Verify Email
      await this.userDB.updateOne({email}, {isVerified: true});

      return {
        success: true,
        message: 'Email verified successfully. You can login now'
      }
    } catch (error) {
      console.log("Verify Email Error");
      throw error;
    }
  }

  //------------- Verify Email --------------
  async sendOtpEmail (email: string) {
    try {
      // Check if the user exists
      const user = await this.userDB.findOne({email});
      if (!user) throw new BadRequestException('User Not Found');

      // Check if the user account is verified
      if (user.isVerified) throw new Error('User Already Verified');

      // Generate new OTP and OTPExpire
      const otp = Math.floor(Math.random() * 900000) + 100000;
      const otpExpiry = new Date();
      otpExpiry.setMinutes(otpExpiry.getMinutes() + 10);

      // Update user OTP and otpExpiry
      await this.userDB.updateOne({email}, {otp, otpExpiry});

      // Send the OTP to user email
      const templateVars = {
        customerEmail: user.email,
        customerName: user.name,
        otp
      }
      await this.mailService.sendEmail('verification', 'Email Verification - SP_STORE', templateVars);

      return {
        success: true,
        message: "OTP send successfully",
        result: {email: user.email}
      }

    } catch (error) {
      console.log("Send OTP to Email Error");
      throw error;
    }
  }

  //------------- Forgot Password --------------
  async forgotPassword (email: string) {
    try {
      // Check if user exists
      const user = await this.userDB.findOne({email});
      if (!user) throw new NotFoundException('User Not Found');

      // Generate new password
      const password = Math.random().toString(36).substring(2, 12);

      // Hashed password
      const hashedPassword = await generateHashPassword(password);

      // Update password in db
      await this.userDB.updateOne({_id: user._id}, {password: hashedPassword});

      // Send the password to the user
      await this.mailService.sendEmail("passwordReset", "Forgot Password - SP_STORE -", {
        customerName: user.name,
        customerEmail: user.email,
        newPassword: password,
        loginLink: process.env.LOGIN_URL
      });

      return {
        success: true,
        message: 'Password send to your email',
        result: {
          email: user.email
        }
      }

    } catch (error) {
      console.log('Forgot Password Error');
      throw error;      
    }
  }

  //------------- Update Name or Password --------------
  async updateNameOrPassword (id: ValidateMongoID, updateNameOrPasswordDto: UpdateUserDto) {
    try {
      const {name, newPassword, oldPassword} = updateNameOrPasswordDto;
      
      // Check if the user exists
      const user = await this.userDB.findOne({_id: id});
      if (!user)
        throw new NotFoundException("User Not Exists");

      // Check new Info
      if (!name && !newPassword)
        throw new BadRequestException("Please provide name or password");
      else if ((newPassword && !oldPassword) || (!newPassword && oldPassword))
        throw new BadRequestException('Please provide both the old and new password');

      // If the request for update the password
      if (newPassword) {
        // Check old password
        const isPasswordMatch = await comparePassword(oldPassword, user.password);
        if (!isPasswordMatch)
          throw new BadRequestException('Invalid current password');

        // Hash the password and update the data
        const password = await generateHashPassword(newPassword);
        await this.userDB.updateOne(
          {_id: id},
          {password}
        );
      }

      // If the request for update the name
      if (name) {
        await this.userDB.updateOne(
          {_id: id},
          {name}
        );
      }

      return {
        success: true,
        message: 'User updated successfully',
        result: {
          name: user.name,
          email: user.email,
          type: user.type,
          id: user._id.toString()
        }
      }
      
    } catch (error) {
      console.log("Update Name or Password Error");
      throw error;
    }
  }

  //------------- Gett All User With Type --------------
  async findAll(type: string) {
    try {
      const users = await this.userDB.findAll({type});
      return {
        success: true,
        message: `Users with type [${type}] fetched successfully`,
        result: {
          users
        }
      }
    } catch (error) {
      console.log('Get all user with type error');
      throw error;
    }
  }

  async findOne(id: ValidateMongoID) {
    try {
      // Check if the user exists
      const user = await this.userDB.findOne({_id: id});
      if (!user) throw new BadRequestException('User Not Found');

      return {
        success: true,
        message: "User Getting successfully",
        result: {user}
      }
    } catch (error) {
      console.log("Get One user Error");
      throw error; 
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`; 
  }

  remove(id: ValidateMongoID) {
    return `This action removes a #${id} user`;
  }
}
