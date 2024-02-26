import { Body, Controller, Query,Get, Param, Post, Put, Delete } from '@nestjs/common';
import { query } from 'express';
import { Observable, from } from 'rxjs';
import { FeedPost } from 'src/feed/models/post.interface';
import { FeedService } from 'src/feed/services/feed/feed.service';
import { DeleteResult, UpdateResult } from 'typeorm';

@Controller('feed')
export class FeedController {
    constructor(private feedService: FeedService) {}

    @Post()
    create(@Body() feedpost: FeedPost): Observable<any> {
        return this.feedService.createPost(feedpost);
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


    @Put(':id')
    update(
        @Body() post: FeedPost,
        @Param('id')id: number
    ): Observable<UpdateResult> {
        return this.feedService.updatePost(id, post);
    }
    
    @Delete(':id')
    delete(
        @Param('id') id: number
    ): Observable<DeleteResult>  {
        return this.feedService.deletePost(id);
    }
}
