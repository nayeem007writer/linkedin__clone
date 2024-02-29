import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Observable, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { User } from '../models/user.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../models/user.entities';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private  jwtService: JwtService,
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
                })).pipe(
                    map((user:User) => {
                        
                        return user;
                    })
                )
            })
        )
    }

    validateUser(email: string, password: string):Observable<User> {
       return from(this.userRepo.findOne({
        where:{email},
        select:['id','email','firstName','lastName','password','role']
       })).pipe(
        switchMap((user: User) => 
            from(bcrypt.compare(password,user.password)).pipe(
                map((isValid: boolean) => {
                    if(isValid) {
                        delete user.password;
                        return user;
                    }
                })
            ) 
        )
       )
    }
    
    login(user: User): Observable<string> {
        const { email, password } = user;
        return this.validateUser(email,password).pipe(
            switchMap((user: User) => {
                if(user) {
                    //create jwt token
                    return from(this.jwtService.signAsync({user}));
                }
            })
        )
    }


}
