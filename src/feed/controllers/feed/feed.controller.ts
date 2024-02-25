import { Body, Controller, Get, Post } from '@nestjs/common';
import { Observable, from } from 'rxjs';
import { FeedPost } from 'src/feed/models/post.interface';
import { FeedService } from 'src/feed/services/feed/feed.service';

@Controller('feed')
export class FeedController {
    constructor(private feedService: FeedService) {}

    @Post()
    create(@Body() feedpost: FeedPost): Observable<any> {
        return this.feedService.createPost(feedpost);
    }


    @Get()
    findAll(): Observable<FeedPost[]> {
        return this.feedService.findAllPosts();
    }
}
