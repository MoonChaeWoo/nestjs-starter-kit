import {Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {PostEntity} from "./entities/post.entity";
import {UsersEntity} from "../users/entities/users.entity";
import {PaginatePostDto} from "./dto/paginate-post.dto";
import {ScrollPagination} from "../../common/utils/paginate/scroll-pagination.utils";

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(PostEntity)
        private readonly postRepository: Repository<PostEntity>,
        @InjectRepository(UsersEntity)
        private readonly usersRepository: Repository<UsersEntity>,
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

    async getOwnerPost(user: Pick<UsersEntity, "email" | "id">) {
        const owner = await this.usersRepository.findOne({
            where: {
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

    uploadPost() {

    }

    updatePost() {

    }

    deletePost() {

    }

    deleteHardPost() {

    }
}
