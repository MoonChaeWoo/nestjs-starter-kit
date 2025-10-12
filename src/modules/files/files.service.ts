import {Injectable, UnauthorizedException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {BaseEntity, Repository} from "typeorm";
import {FilesEntity} from "./entities/files.entity";
import type {MulterFile} from "../../common/type/common.type";
import {dirname, extname, join} from 'path';
import {CreateFileDto} from "./dto/create-file.dto";
import {UsersEntity} from "../users/entities/users.entity";
import {PostEntity} from "../post/entities/post.entity";
import sharp from "sharp";
import {mkdirSync} from "node:fs";
import {ConfigService} from "@nestjs/config";
import {v4 as uuid} from "uuid";
import {mkdir, unlink, writeFile} from "node:fs/promises";

@Injectable()
export class FilesService {
    constructor(
        @InjectRepository(FilesEntity)
        private readonly fileRepository: Repository<FilesEntity>,
        @InjectRepository(UsersEntity)
        private readonly usersRepository: Repository<UsersEntity>,
        private readonly configService: ConfigService,
    ) {}

    async uploadBFileDisk<T extends BaseEntity>(file: MulterFile, userId: string, entity?: T) {
        try{
            const uploadUser = await this.usersRepository.findOne({where: {id: userId}});
            if(!uploadUser) throw new UnauthorizedException('파일은 유효한 사용자만 업로드 할 수 있습니다.');

            const uploadFile = new CreateFileDto();
            uploadFile.originalName = file.originalname;
            uploadFile.storedName = file.filename;
            uploadFile.mimetype = file.mimetype;
            uploadFile.path = dirname(file.path);
            uploadFile.size = file.size;
            uploadFile.extension = extname(file.filename);
            uploadFile.uploadedBy = uploadUser;

            if (entity && entity instanceof PostEntity) {
                uploadFile.post = entity;
            }

            const createFile = this.fileRepository.create(uploadFile);
            return await this.fileRepository.save(createFile);
        }catch (error){
            throw error;
        }
    }

    async uploadFileMemory<T extends BaseEntity>(saveLocation: string, files: MulterFile[], userId: string, entity?: T){
        const savedFiles: string[] = [];

        try{
            const uploadUser = await this.usersRepository.findOne({where: {id: userId}});
            if(!uploadUser) throw new UnauthorizedException('파일은 유효한 사용자만 업로드 할 수 있습니다.');

            const today = new Date();
            const uploadPath = join(
                process.cwd(),
                this.configService.get<string>('FILE_UPLOAD_DIR') || 'upload',
                saveLocation,
                today.getFullYear().toString(),
                String((today.getMonth() + 1)).padStart(2, '0'),
                String(today.getDate()).padStart(2, '0')
            );

            // 디렉터리 생성
            mkdirSync(join(uploadPath, 'thumbnail'), { recursive: true });

            const results = await Promise.allSettled(files.map(async(file) => {
                const uploadFile = new CreateFileDto();
                uploadFile.originalName = file.originalname;
                uploadFile.extension = extname(file.originalname);
                uploadFile.mimetype = file.mimetype;
                uploadFile.size = file.size;
                uploadFile.uploadedBy = uploadUser;

                // 원본 파일 저장
                await writeFile(join(uploadPath, `${uuid()}${extname(file.originalname)}`), file.buffer);
                uploadFile.storedName = join(uploadPath, `${uuid()}${extname(file.originalname)}`);
                uploadFile.path = uploadPath;
                savedFiles.push(`${uuid()}${extname(file.originalname)}`);

                // 썸네일 저장 (썸네일 생성 가능한 파일만)
                const allowedExtensions = [
                    '.jpg', '.jpeg', '.png', '.bmp', '.webp', '.gif',
                    '.tiff', '.avif', '.heif', '.heic'];
                const fileExt = extname(file.originalname).toLowerCase();
                if (allowedExtensions.includes(fileExt)) {
                    await sharp(file.buffer)
                        .resize({ width: 200, height: 200, fit: 'inside', withoutEnlargement: true })
                        .toFormat('webp', { quality: 60 })
                        .toFile(join(uploadPath, 'thumbnail', `${uuid()}.webp`));
                    savedFiles.push(join(uploadPath, 'thumbnail', `${uuid()}.webp`));
                    uploadFile.thumbnail = join(uploadPath, 'thumbnail', `${uuid()}.webp`);
                }

                if (entity && entity instanceof PostEntity) {
                    uploadFile.post = entity;
                }

                const createFile = this.fileRepository.create(uploadFile);
                return await this.fileRepository.save(createFile);
            }));

            return { success : results.every(value => value.status === 'fulfilled')};
        }catch(error){
            // 실패 시 저장된 파일 모두 삭제
            await Promise.allSettled(savedFiles.map(path => unlink(path)));
            throw error;
        }
    }

    downloadFile(id:number){

    }

    replaceFile(id:number){

    }

    deleteFile(id:number){

    }

}
