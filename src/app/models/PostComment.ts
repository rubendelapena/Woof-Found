export class PostComment {
    createdAt: number;
    id: string;
    text: string;
    userId: string;
    userName: string;

    public constructor() {
        this.createdAt = null;
        this.id = null;
        this.text = '';
        this.userId = null;
        this.userName = null;
    }
}