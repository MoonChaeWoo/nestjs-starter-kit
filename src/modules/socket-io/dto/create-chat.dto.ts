import {IsNumber} from "class-validator";

export class CreateChatDto {
    @IsNumber({}, { each: true, message: '배열의 모든 값은 숫자여야 합니다.' })
    userIds: number[]
}