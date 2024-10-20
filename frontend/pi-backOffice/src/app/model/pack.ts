import {Stand} from "./stand"
import { Forum } from "./forum";
import { User } from "./user";
import { reservationStatus } from "./reservationStatus";
export class Pack {
    id!: number;
    typePack!: string;
    prix!: number;
    reservationStatus!: string;
    forum!: Forum;
    stand!: Stand;
    reserver !: User; 
    reservationDate!: Date; 
    validationDate!: Date; 
    numberOfOffers! : number;
    numberOfBadges!: number;
    numberOfFlyers!: number;
    displayLogo!: boolean;
    insertFlyer!: boolean
}