import { FeedPost } from "src/feed/models/post.interface";
import { Role } from "./role.entities";
import { IsEmail, IsString } from "class-validator";

export class User {
    id?: number;
    firstName: string;
    lastName: string;

    @IsEmail()
    email: string;

    @IsString()
    password: string;
    imagePath?: string;
    role?: Role;
    posts?: FeedPost[];
}

export interface LogIn{
    email: string;
    password: string;
}