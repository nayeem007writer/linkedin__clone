import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable, catchError, from, map, throwError } from 'rxjs';
import { User } from 'src/auth/models/user.class';
import { FeedPostEntity } from 'src/feed/models/post.entities';
import { FeedPost } from 'src/feed/models/post.interface';

import { DeleteResult, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class FeedService {
    constructor(
        @InjectRepository(FeedPostEntity)
        private feeddrepo: Repository<FeedPostEntity>
    ) {}


    createPost(user: User,post: FeedPost): Observable<FeedPostEntity> {
        const { id, body, createdAt } = post;
        const author = user;
        const newPostEntity = this.feeddrepo.create({
            body,
            createdAt,
            author
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

    findPostById(id: number): Observable<FeedPost> {
        return from(
            this.feeddrepo.findOne({
                where:{id},
                relations: ['author']
            })
        )
    }


}


