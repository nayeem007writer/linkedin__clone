import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User } from '../models/user.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../models/user.entities';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity) private readonly userRepo: Repository<UserEntity>
    ) {}
    hashedPassword(password: string): Observable<string> {
        return from(bcrypt.hash(password,12));
    }

    registerAccount(user: User): Observable<User> {
        const { firstName, lastName, email, password} = user;


        return this.hashedPassword(password).pipe(
            switchMap((hashedPassword: string) =>{
                return from(this.userRepo.save({
                    firstName,
                    lastName,
                    email,
                    password: hashedPassword
                }))
            })
        )
    }
}
