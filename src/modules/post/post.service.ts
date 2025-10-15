import {Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {DataSource, Repository} from "typeorm";
import {PostEntity} from "./entities/post.entity";
import {UsersEntity} from "../users/entities/users.entity";
import {PaginatePostDto} from "./dto/paginate-post.dto";
import {ScrollPagination} from "../../common/utils/paginate/scroll-pagination.utils";
import type {MulterFile} from "../../common/type/common.type";
import {FilesService} from "../files/files.service";
import {CreatePostDto} from "./dto/create-post.dto";
import type {USER_REQ} from "../auth/type/auth.type";

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(PostEntity)
        private readonly postRepository: Repository<PostEntity>,
        @InjectRepository(UsersEntity)
        private readonly usersRepository: Repository<UsersEntity>,
        private readonly fileService: FilesService,
        private readonly dataSource: DataSource,
    ) {}

    async paginatePost(query: PaginatePostDto) {
        return ScrollPagination(this.postRepository, query, '/post/page');
    }

    async getAllPosts(): Promise<PostEntity[]> {
        return await this.postRepository.find();
    }

    async getPostById(uid: number): Promise<PostEntity> {
        const targetPost = await this.postRepository.findOne({
            where: {
                uid : uid
            }
        });

        if(!targetPost) throw new NotFoundException("게시물이 없거나 삭제되었을 수 있습니다.");

        return targetPost;
    }

    async getOwnerPost(user: USER_REQ) {
        const owner = await this.usersRepository.findOne({
            where: {
                uid: user.uid,
                id : user.id,
                email : user.email
            }
        });

        if(!owner) throw new UnauthorizedException('요청하신 작업을 처리할 수 없습니다. 사용자 정보가 올바르지 않습니다.');

        return await this.postRepository.find({
            where: {
                author : owner
            }
        });
    }

    async uploadBFileDiskPost(post: CreatePostDto, userReq: USER_REQ, files : MulterFile[]) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try{
            const user = await this.usersRepository.findOne({where: {id : userReq.id}});
            if(!user) throw new UnauthorizedException('유효하지 않은 사용자입니다.');

            const postCreate = queryRunner.manager.create(PostEntity, {...post, author : user});
            const postSave = await queryRunner.manager.save(postCreate);

            const {success, message, count} = await this.fileService.uploadBFileDisk(
                files,
                userReq,
                {
                    entity: postSave,
                    type : 'PostEntity',
                    queryRunner,
                }
            );

            if(!success){
                throw new InternalServerErrorException('file upload error => ', message);
            }

            await queryRunner.commitTransaction();
            return {
                success : true,
                message : '게시글 등록 완료',
                files_count: count
            }
        }catch(error){
            await queryRunner.rollbackTransaction();
            throw error;
        }finally {
            await queryRunner.release();
        }
    }

    async uploadFileMemoryPost(post: CreatePostDto, userReq: USER_REQ, files: MulterFile[]) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try{
            const user = await this.usersRepository.findOne({where: {id : userReq.id}});
            if(!user) throw new UnauthorizedException('유효하지 않은 사용자입니다.');

            const postCreate = queryRunner.manager.create(PostEntity, {...post, author : user});
            const postSave = await queryRunner.manager.save(postCreate);

            const {success, message, count} = await this.fileService.uploadFileMemory(
                'post',
                files,
                userReq,
                {
                    entity: postSave,
                    type : 'PostEntity',
                    queryRunner
                }
            );

            if(!success){
                throw new InternalServerErrorException('file upload error => ', message);
            }

            await queryRunner.commitTransaction();
            return {
                success : true,
                message : '게시글 등록 완료',
                files_count: count
            }
        }catch(error){
            await queryRunner.rollbackTransaction();
            throw error;
        }finally {
            await queryRunner.release();
        }
    }

    updatePost() {

    }

    deletePost() {

    }

    deleteHardPost() {

    }

}
