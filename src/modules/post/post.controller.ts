import {Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards} from '@nestjs/common';
import { PostService } from './post.service';
import {BearerTokenGuard} from "../auth/guard/bearer-token.guard";
import {User} from "../users/decorator/user.decorator";
import {UsersEntity} from "../users/entities/users.entity";
import {BasePaginateDto} from "../../common/utils/paginate/dto/base-paginate.dto";
import {PaginatePostDto} from "./dto/paginate-post.dto";

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}
    @Get()
    getALlPost(){
        return this.postService.getAllPosts();
    }

    @Get('page')
    getPaginatePost(
        @Query() query: PaginatePostDto
    ){
        return this.postService.paginatePost(query);
    }

    @Get(':uid')
    getPostById(@Param('uid', ParseIntPipe) uid: number){
      return this.postService.getPostById(uid);
    }

    @Get('owner')
    @UseGuards(BearerTokenGuard)
    getOwnerPost(
        @User() user: Pick<UsersEntity, 'email' | 'id'>,
    ){
        return this.postService.getOwnerPost(user);
    }

    @Post('upload')
    uploadPost(){
        return this.postService.uploadPost();
    }

    @Patch('update/:uid')
    updatePost(
        @Param('uid', ParseIntPipe) uid: number
    ){
        return this.postService.updatePost();
    }

    @Delete('delete/:uid')
    deletePost(
        @Param('uid', ParseIntPipe) uid: number
    ){
        return this.postService.deletePost();
    }

    @Delete('delete/hard/:uid')
    deleteHardPost(
        @Param('uid', ParseIntPipe) uid: number
    ){
        return this.postService.deleteHardPost();
    }


}
