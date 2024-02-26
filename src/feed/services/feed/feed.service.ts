import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable, Observer, catchError, from, map, throwError } from 'rxjs';
import { FeedPostEntity } from 'src/feed/models/post.entities';
import { FeedPost } from 'src/feed/models/post.interface';

import { DeleteResult, Repository, UpdateResult } from 'typeorm';

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

    findPosts(take: number = 2, skip: number = 1): Observable<FeedPost[]> {
        return from(this.feeddrepo.findAndCount({ take, skip })).pipe(
            map(([posts]) => <FeedPost[]><unknown>posts)
        );
    }

    findAllPosts(): Observable<any[]> {
     return from(this.feeddrepo.find());
    }

    updatePost(id: number, feedPost: FeedPost): Observable<UpdateResult> {
        const {body} =feedPost;
       return from(this.feeddrepo.update(id,{body}));
    }
    
    deletePost(id:number): Observable<DeleteResult> {
        return from(this.feeddrepo.delete(id));
    }


}


