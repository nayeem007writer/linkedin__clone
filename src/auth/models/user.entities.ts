import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "./role.entities";
import { FeedPostEntity } from "src/feed/models/post.entities";
import { FriendRequestEntity } from "./friend.request.entity";


@Entity('user')
export class UserEntity extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({unique: true})
    email: string;


    @Column({ select: false})
    password: string;

    @Column({ nullable: true})
    imagePath: string;

    @Column({type: 'enum', enum: Role, default: Role.ADMIN})
    role: Role;

    @OneToMany(()=> FeedPostEntity,(feedPost) => feedPost.author)
    feedPosts: FeedPostEntity[];

    @OneToMany(()=> FriendRequestEntity,(friendRequestEntity) => friendRequestEntity.creator)
    sentFriendRequests: FriendRequestEntity[];

    @OneToMany(()=> FriendRequestEntity,(friendRequestEntity) => friendRequestEntity.receiver)
    receiveFriendRequests: FriendRequestEntity[];
}