import { Inject, Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { UserRepository } from "../repositories/user.repository";
import { NextFunction, Request, Response } from "express";
import { decodeAuthToken } from "../utility/token.management";
import { JwtPayload } from "jsonwebtoken";


@Injectable()
export class AuthMiddleware implements NestMiddleware {

  constructor (
    @Inject(UserRepository) private readonly userDB: UserRepository
  ){}

  async use(req: Request | any, res: Response | any, next: NextFunction) {
    try {      
      // Check if the token exists
      const token = req.cookies._sp_store_auth_token;
      if (!token)
        throw new UnauthorizedException("Missing Auth Token");

      // Decode the token (id) and get the user
      const decodedData: any| JwtPayload = decodeAuthToken(token);
      const {id} = decodedData;
      const user = await this.userDB.findById(id);

      // Chech the user
      if (!user)
        throw new UnauthorizedException('Unauthorized');

      // Reset password and passe the user info with request
      user.password = undefined;
      req.user = user;

      next();
    } catch (error) {
      console.log("Auth Middleware Error");
      throw new UnauthorizedException(error.message);
    }
  };
}