import {PickType} from "@nestjs/mapped-types";
import {CreateAuthDto} from "./create-auth.dto";

export class AuthenticateDto extends PickType(CreateAuthDto, ['email', 'id' , 'password']) {}