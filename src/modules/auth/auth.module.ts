import {forwardRef, Module} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {JwtModule} from "@nestjs/jwt";
import {UsersModule} from "../users/users.module";
import {RoleModule} from "../role/role.module";

@Module({
    imports: [
        JwtModule.register({}),
        forwardRef(() => UsersModule),
        RoleModule
    ],
    exports: [AuthService],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}
