import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable, catchError, from, map, throwError } from 'rxjs';
import { FeedPostEntity } from 'src/feed/models/post.entities';
import { FeedPost } from 'src/feed/models/post.interface';

import { Repository } from 'typeorm';

@Injectable()
export class FeedService {
    constructor(
        @InjectRepository(FeedPostEntity)
        private feeddrepo: Repository<FeedPostEntity>
    ) {}


    createPost(post: FeedPost): Observable<FeedPostEntity> {
        const { id, body, createdAt } = post;

        const newPostEntity = this.feeddrepo.create({
            body,
            createdAt,
        });

        return from(this.feeddrepo.save(newPostEntity)).pipe(
            catchError((error) => {
                console.error('Error saving post:', error);
                return throwError(error);
            })
        );
    }

    findAllPosts(): Observable<any[]> {
     return from(this.feeddrepo.find());
    }

}


