import { Owner } from "./Owner";
import { PostComment } from "./PostComment";
import { Loc } from "../interfaces/Loc";

export class Post {
    animal: string;
    breed: string;
    comments: PostComment[];
    createdAt: number;
    description: string;
    id: string;
    lostDate: number;
    lostPlace: Loc;
    ownerContactInfo: Owner;
    petAge: number;
    petName: string;
    reward: number;
    userId: string;

    public constructor () {
        this.animal = null;
        this.breed = null
        this.createdAt = null;
        this.description = '';
        this.id = null;
        this.lostDate = null;
        this.lostPlace = null;
        this.ownerContactInfo = new Owner();
        this.petAge = null;
        this.petName = '';
        this.reward = 0;
        this.userId = null;
    }
}