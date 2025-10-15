import {PickType} from "@nestjs/mapped-types";
import {CreateAuthDto} from "./create-auth.dto";
import {IsNumber} from "class-validator";

export class AuthenticateDto extends PickType(CreateAuthDto, ['email', 'id' , 'password']) {
    @IsNumber()
    uid: number;
}