import { Forum } from "./forum";
import { Reclamation } from "./reclamation";
import { Sponsor } from "./sponsor";

export class User {
    id!: string;
    username!: string;
    password!: string;
    email!: string;
    reclamations!: Reclamation[];
    sponsors!: Sponsor[];
    approve!:boolean;
    activate!:boolean;
    forums!: Forum[];
}