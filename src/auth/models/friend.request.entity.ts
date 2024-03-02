import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entities";
import { FriendRequest_Status } from "./friend.request.interface";



@Entity('request')
export class FriendRequestEntity extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserEntity, (userEntity) => userEntity.sentFriendRequests)
    creator: UserEntity;

    @ManyToOne(() => UserEntity, (userEntity) => userEntity.receiveFriendRequests)
    receiver: UserEntity;

    @Column()
    status: FriendRequest_Status;
}