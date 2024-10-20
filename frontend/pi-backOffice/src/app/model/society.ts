import { Devis } from "./devis";
import { SocietyRole } from "./societyRole";
import { User } from "./user";

export class Society extends User {

    override id!: string;
    matricule!: number;
    logo!: string;
    adresse!: string;
    owner!: string;
    sector!: string;
    sitFin!: string;
    representative!: string;
    role!: SocietyRole;
    devis!: Devis[];
}