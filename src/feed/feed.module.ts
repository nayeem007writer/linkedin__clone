import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedPostEntity } from './models/post.entities';
import { FeedController } from './controllers/feed/feed.controller';
import { FeedService } from './services/feed/feed.service';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AuthModule } from 'src/auth/auth.module';
import { IsCreatorGuard } from './guards/is-creator.guard';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([FeedPostEntity]),
  ],
  controllers: [ FeedController ],
  providers: [ FeedService, IsCreatorGuard, RolesGuard ] 
})
export class FeedModule {}
