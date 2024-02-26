import { UserEntity } from "src/auth/models/user.entities";
import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity('feed_post')
export class FeedPostEntity extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    body: string;

    @Column({ type: 'timestamp',default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;


    @ManyToOne(() => UserEntity, (userEntity) => userEntity.feedPosts)
    author: UserEntity;
}