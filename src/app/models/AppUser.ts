import { Post } from "./Post";
import { Loc } from "../interfaces/Loc";

export class AppUser {
    birthday: number;
    email: string;
    id: string;
    location: Loc;
    name: string;
    phoneNumber: number;
    posts: Post[];
}