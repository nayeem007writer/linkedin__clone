import { FeedPost } from "src/feed/models/post.interface";
import { Role } from "./role.entities";

export interface User {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    imagePath?: string;
    role?: Role;
    posts?: FeedPost[];
}

export interface LogIn{
    email: string;
    password: string;
}