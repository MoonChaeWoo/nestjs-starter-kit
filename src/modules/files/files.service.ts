import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {FilesEntity} from "./entities/files.entity";

@Injectable()
export class FilesService {
    constructor(
        @InjectRepository(FilesEntity)
        private readonly fileRepository: Repository<FilesEntity>,
    ) {}

}
