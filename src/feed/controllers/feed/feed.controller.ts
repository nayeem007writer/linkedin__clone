import { Body, Controller, Query,Get, Param, Request,Post, Put, Delete, UseGuards } from '@nestjs/common';
import { query } from 'express';
import { Observable, from } from 'rxjs';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/auth/models/role.entities';
import { IsCreatorGuard } from 'src/feed/guards/is-creator.guard';
import { FeedPost } from 'src/feed/models/post.interface';
import { FeedService } from 'src/feed/services/feed/feed.service';
import { DeleteResult, UpdateResult } from 'typeorm';

@Controller('feed')
export class FeedController {
    constructor(private feedService: FeedService) {}

    @Roles(Role.ADMIN,Role.USER)
    @UseGuards(JwtGuard,RolesGuard)
    @Post()
    create(@Body() feedpost: FeedPost, @Request() req): Observable<any> {
        return this.feedService.createPost(req.user,feedpost);
    }


    // @Get()
    // findAll(): Observable<FeedPost[]> {
    //     return this.feedService.findAllPosts();
    // }

    @Get()
    findAll(
        @Query('take')take: number = 1,
        @Query('skip') skip: number =1,
    ): Observable<FeedPost[]> {
        take = take >20 ?20: take;
        return this.feedService.findPosts(take, skip);
    }


    @UseGuards(JwtGuard,IsCreatorGuard)
    @Put(':id')
    update(
        @Body() post: FeedPost,
        @Param('id')id: number
    ): Observable<UpdateResult> {
        return this.feedService.updatePost(id, post);
    }
    
    @UseGuards(JwtGuard,IsCreatorGuard)
    @Delete(':id')
    delete(
        @Param('id') id: number
    ): Observable<DeleteResult>  {
        return this.feedService.deletePost(id);
    }
}
