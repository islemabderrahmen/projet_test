import { Interview } from "./interview";
import { Individu } from "./individus";

import { Status } from "./status";
import { Offer } from "./offer";
export class Candidature {
    idCandidature!: number;
    date!: Date;
    status!: Status;
    cv!: string;
    lettre!: string;
    interview!: Interview;
    individu!: Individu;
    offer!:Offer;
    isAccepted(): boolean {
        return this.status === Status.Accepted;
    }
}