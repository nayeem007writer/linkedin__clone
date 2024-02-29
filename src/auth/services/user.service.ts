import { Injectable } from '@nestjs/common';
import { Observable, from, map } from 'rxjs';
import { User } from '../models/user.interface';
import { UserEntity } from '../models/user.entities';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
        ) {}

    findUserById(id: number): Observable<User> {


        return from(
            this.userRepo.findOne({
                where:{id},
                relations: ['feedPosts']
            })
        ).pipe(
            map((user: User) => {
                delete user.password;
                return user;
            })
        )
    }

    updateUserImageById(id: number, imagePath: string): Observable<UpdateResult>{
        const user: User = new UserEntity();

        user.id = id;
        user.imagePath = imagePath;
        return from(this.userRepo.update(id, user));
    }

    findImageNameByUserId(id: number): Observable<string> {
        return from(this.userRepo.findOne({where:{id}})).pipe(
            map((user: User) => {
                delete user.password;
                return user.imagePath;
            })
        )
    }
}
