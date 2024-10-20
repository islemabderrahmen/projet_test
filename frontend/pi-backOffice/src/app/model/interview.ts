import { Candidature } from "./candidature";
import { InterviewType } from "./interviewType";
import { Room } from "./room";

export class Interview {
    idInterview!: number;
    date!: Date;
    lien!:string;
    interviewType!:InterviewType;
    candidature!: Candidature;
    room!: Room[];
    titre!:string;
    rooms!: Room[];
}