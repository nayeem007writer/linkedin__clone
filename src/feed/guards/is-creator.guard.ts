import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable, map, switchMap } from 'rxjs';
import { User } from 'src/auth/models/user.interface';
import { AuthService } from 'src/auth/services/auth.service';
import { FeedService } from '../services/feed/feed.service';
import { FeedPost } from '../models/post.interface';
import { UserService } from 'src/auth/services/user.service';

@Injectable()
export class IsCreatorGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private feedService: FeedService
    ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requrst = context.switchToHttp().getRequest();
    const { user, params }: {user: User; params: {id: number}} = requrst;

    if(!user || !params) return false;

    if(user.role === "admin") return true; // allow admin to get make requests

    const userId = user.id;
    const feedId = params.id;

    return this.userService.findUserById(userId).pipe(
      switchMap((user: User) =>
        this.feedService.findPostById(feedId).pipe(
          map((feedPost: FeedPost) => {
            let isAuthor = user.id === feedPost.author.id;
            return isAuthor;
          }),
        ),
      ),
    );

  }
}
