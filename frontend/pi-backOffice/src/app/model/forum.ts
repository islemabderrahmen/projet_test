
import { forumStatus } from "./forumStatus";
import { Pack } from "./pack";
import { User } from "./user";

export class Forum {
    id!: number;
    date!: Date;
    localisation!: string;
    description!: string;
    theme!: string;
    forumStatus !: string; 
    users!: User[];
    packs!: Pack[];
    
}