export class Filter {
    animal: string;
    breed: string;
    reward: { min: number, max: number };
    country: string;
    state: string;
    city: string;
    
    public constructor() {
        this.animal = null;
        this.breed = null;
        this.reward = null;
        this.country = null;
        this.state = null;
        this.city = null;
    }
}