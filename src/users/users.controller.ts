import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode, Res, Put, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Response } from 'express';
import { Roles } from 'src/shared/guards/role.decorators';
import { userTypes } from 'src/enums/users.enums';
import { ValidateMongoID } from 'src/shared/pipes/ValidateMongoId.pipe';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post() // Create New User
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  
  @Post('/login')//- Login User
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginUserDto: LoginUserDto, @Res({passthrough: true}) response: Response) {
    const loginRes: any = await this.usersService.login(loginUserDto);
    
    if (loginRes.success) {
      response.cookie('_sp_store_auth_token', loginRes.result?.token, {httpOnly: true});
    }

    delete loginRes.result?.token;
    return loginRes;
  }

  @Get('/verify-email/:otp/:email') // Verify User Account
  async verifyEmail(@Param('otp') otp: string, @Param('email') email: string) {
    return await this.usersService.verifyEmail(otp, email);
  }

  @Get('/send-otp-email/:email') // Resend OTP
  async sendOtpEmail (@Param('email') email: string) {
    return await this.usersService.sendOtpEmail(email);
  }

  @Delete('/logout') // Logout
  async logout(@Res() res: Response) {
    res.clearCookie('_sp_store_auth_token');
    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Logout Successfully'
    })
  }

  @Get('forgot-password/:email') // Forget Password
  async forgotPassword(@Param('email') email:string) {
    return this.usersService.forgotPassword(email);
  }

  @Get() // Get User By Type
  @Roles(userTypes.ADMIN)
  async findAll(@Query('type') type: string) {
    return this.usersService.findAll(type);
  }

  @Get('/:id')
  findOne(@Param('id') id: ValidateMongoID) {
    return this.usersService.findOne(id);
  }

  @Patch('/update-name-password/:id')// Update user info like name or password
  update(@Param('id') id: ValidateMongoID, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateNameOrPassword(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: ValidateMongoID) {
    return this.usersService.remove(id);
  }
}
