import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {FilesEntity} from "./entities/files.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([FilesEntity]),
    ],
    controllers: [FilesController],
    providers: [FilesService],
})
export class FilesModule {}
