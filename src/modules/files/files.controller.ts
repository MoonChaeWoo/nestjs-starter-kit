import {Controller, UseInterceptors} from '@nestjs/common';
import { FilesService } from './files.service';
import {FileInterceptor} from "@nestjs/platform-express";

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

    //@UseInterceptors(FileInterceptor('file')) // HTML form의 <input type="file" name="file" /> 에서 name 속성과 일치해야 함
}
