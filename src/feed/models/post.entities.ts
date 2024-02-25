import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity('feed_post')
export class FeedPostEntity extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    body: string;

    @Column({ type: 'timestamp',default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}