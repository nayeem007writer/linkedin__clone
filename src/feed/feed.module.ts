import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedPostEntity } from './models/post.entities';
import { FeedController } from './controllers/feed/feed.controller';
import { FeedService } from './services/feed/feed.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FeedPostEntity]),
  ],
  controllers: [FeedController],
  providers: [FeedService]
})
export class FeedModule {}
