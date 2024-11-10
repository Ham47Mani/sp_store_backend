import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { userTypes } from "src/enums/users.enums";
import { ROLES_KEY } from "./role.decorators";


@Injectable()
export class RoleGuard implements CanActivate {

  constructor (private reflactor: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get the require roles and check
    const requireRoler = this.reflactor.getAllAndOverride<userTypes[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);
    if (!requireRoler)
      return true;

    const {user} = context.switchToHttp().getRequest();
    const hasRole = requireRoler.some(role => user.type?.includes(role));
    if (!hasRole)
      throw new UnauthorizedException("You can't access to this path");  

    return true;
  }
}