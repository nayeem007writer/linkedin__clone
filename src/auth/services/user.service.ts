import { Injectable } from '@nestjs/common';
import { Observable, from, map, of, switchMap } from 'rxjs';
import { User } from '../models/user.interface';
import { UserEntity } from '../models/user.entities';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { FriendRequest, FriendRequestStatus } from '../models/friend.request.interface';
import { FriendRequestEntity } from '../models/friend.request.entity';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
        @InjectRepository(FriendRequestEntity) private friendRequestRepositoy: Repository<FriendRequestEntity>,
    ) { }

    findUserById(id: number): Observable<User> {


        return from(
            this.userRepo.findOne({
                where: { id },
                relations: ['feedPosts']
            })
        ).pipe(
            map((user: User) => {
                delete user.password;
                return user;
            })
        )
    }

    updateUserImageById(id: number, imagePath: string): Observable<UpdateResult> {
        const user: User = new UserEntity();

        user.id = id;
        user.imagePath = imagePath;
        return from(this.userRepo.update(id, user));
    }

    findImageNameByUserId(id: number): Observable<string> {
        return from(this.userRepo.findOne({ where: { id } })).pipe(
            map((user: User) => {
                delete user.password;
                return user.imagePath;
            })
        )
    }
    hasRequestBeenSentOrReceived(
        creator: User,
        receiver: User,
    ): Observable<boolean> {
        return from(
            this.friendRequestRepositoy.findOne({
                where: [
                    { creator, receiver },
                    { creator: receiver, receiver: creator },
                ],
            }),
        ).pipe(
            switchMap((friendRequest: FriendRequest) => {
                if (!friendRequest) return of(false);
                return of(true);
            }),
        );
    }

    sendFriendRequest(receiverId: number, creator: User): Observable<FriendRequest | { error: string }> {
        if (receiverId === creator.id) return of({ error: "invalid credential" });

        return this.findUserById(receiverId).pipe(
            switchMap((receiver: User) => {
                return this.hasRequestBeenSentOrReceived(creator, receiver).pipe(
                    switchMap((hasRequestBeenSentOrReceived: boolean) => {
                        if (hasRequestBeenSentOrReceived) return of({ error: "Friend request has been already been send" })

                        let friendRequest: FriendRequest = {
                            creator,
                            receiver,
                            status: 'pending',
                        }
                        return from(this.friendRequestRepositoy.save(friendRequest,));
                    })
                )
            })
        )
    }

    getFriendRequestStatus(
        receiverId: number,
        currentUser: User
    ): Observable<FriendRequestStatus> {
        return this.findUserById(receiverId).pipe(
            switchMap((receiver: User) => {
                return from(this.friendRequestRepositoy.findOne({
                    where: [
                        { creator: currentUser },
                        { receiver: receiver }
                    ]
                }))
            }),

            switchMap((friendRequest: FriendRequest) => {
                return of({ status: friendRequest.status })
            })
        )
    }

    getUserFriendRequestUserById( friendRequestId: number): Observable<FriendRequest> {
        return from(this.friendRequestRepositoy.findOne({
            where: [{id:friendRequestId}]
        }))
    }

    responseToFriendRequest(
        statusResponse: FriendRequestStatus,
        friendRequestId: number

    ): Observable<FriendRequestStatus> {
        return this.getUserFriendRequestUserById(friendRequestId).pipe(
            switchMap((friendRequest: FriendRequest) => {
                return from(this.friendRequestRepositoy.save({
                    ...friendRequest,
                    status: statusResponse.status,
                }))
            })
        )
    }

    getFriendRequestsFromRecipients(currentUser: User): Observable<FriendRequest []> {
        return from(this.friendRequestRepositoy.find({
            where: [{receiver: currentUser}]
        }))
    }
}
