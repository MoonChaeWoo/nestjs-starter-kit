import {BadRequestException, Injectable, UnauthorizedException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
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
import {unlink, writeFile} from "node:fs/promises";
import {BaseEntity} from "../../common/entities/base.entity";
import {plainToInstance} from "class-transformer";
import type {USER_REQ} from "../auth/type/auth.type";

@Injectable()
export class FilesService {
    constructor(
        @InjectRepository(FilesEntity)
        private readonly fileRepository: Repository<FilesEntity>,
        @InjectRepository(UsersEntity)
        private readonly usersRepository: Repository<UsersEntity>,
        private readonly configService: ConfigService,
    ) {}

    async getFileUrl(fileUuid: string) {
        try{
            const file = await this.fileRepository.findOne({
                where : {
                    storedName: fileUuid,
                }
            });
            if(!file) throw new BadRequestException('해당 파일을 찾을 수 없습니다. 파일명이나 파일 경로가 정확한지 다시 한번 확인하세요.');

            const transformed = plainToInstance(FilesEntity, file, {
                excludeExtraneousValues: false,
            });

            return {
                success: true,
                url : transformed.url,
            };
        }catch(error){
            throw error;
        }
    }

    async uploadBFileDisk<T extends BaseEntity>(files: MulterFile[], user: USER_REQ, options?: { entity?: T; type: string }) {
        if(files.length < 1) return {
            success : true,
            message : '파일할 파일 없음',
            count : 0,
        };

        const savedFiles: string[] = [];
        try{
            const uploadUser = await this.usersRepository.findOne({where: {
                uid: user.uid,
                id: user.id,
                email: user.email,
            }});
            if(!uploadUser) throw new UnauthorizedException('파일은 유효한 사용자만 업로드 할 수 있습니다.');

            const results = await Promise.allSettled(files.map(async(file) => {
                const uploadFile = new CreateFileDto();
                uploadFile.originalName = file.originalname;
                uploadFile.storedName = file.filename;
                uploadFile.mimetype = file.mimetype;
                uploadFile.path = dirname(file.path);
                uploadFile.url = file.path.slice(file.path.indexOf('/upload') + 7);
                uploadFile.size = file.size;
                uploadFile.extension = extname(file.filename);
                uploadFile.uploadedBy = uploadUser;

                if (options && options.entity && options.type === 'PostEntity') {
                    uploadFile.post = options.entity as unknown as PostEntity;
                }

                savedFiles.push(file.path);

                const createFile = this.fileRepository.create(uploadFile);
                return await this.fileRepository.save(createFile);
            }));
            return {
                success : results.every(value => value.status === 'fulfilled'),
                message : '파일 업로드 완료',
                count : files.length,
            };
        }catch (error){
            // 실패 시 저장된 파일 모두 삭제
            await Promise.allSettled(savedFiles.map(path => unlink(path)));
            return {
                success : false,
                message : error.message,
                count : files.length,
            };
        }
    }

    async uploadFileMemory<T extends BaseEntity>(saveLocation: string, files: MulterFile[], user: USER_REQ, options?: { entity?: T; type: string }){
        if(files.length < 1) return {
            success : true,
            message : '파일할 파일 없음',
            count : 0,
        };

        const savedFiles: string[] = [];
        try{
            const uploadUser = await this.usersRepository.findOne({where: {
                uid: user.uid,
                id: user.id,
                email: user.email,
            }});
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
                const fileName = `${uuid()}${extname(file.originalname)}`;
                await writeFile(join(uploadPath, fileName), file.buffer);
                uploadFile.storedName = fileName;
                uploadFile.path = uploadPath;
                uploadFile.url = join(
                    uploadPath.slice(uploadPath.indexOf('/upload') + 7),
                    fileName
                );
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

                if (options && options.entity && options.type === 'PostEntity') {
                    uploadFile.post = options.entity as unknown as PostEntity;
                }

                const createFile = this.fileRepository.create(uploadFile);
                return await this.fileRepository.save(createFile);
            }));

            return {
                success : results.every(value => value.status === 'fulfilled'),
                message : '파일 업로드 완료',
                count : files.length,
            };
        }catch(error){
            // 실패 시 저장된 파일 모두 삭제
            await Promise.allSettled(savedFiles.map(path => unlink(path)));
            return {
                success : false,
                message : error.message,
                count : files.length,
            };
        }
    }

    downloadFile(id:number){

    }

    replaceFile(id:number){

    }

    deleteFile(id:number){

    }


}
