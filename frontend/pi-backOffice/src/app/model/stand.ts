import { Pack } from "./pack";
import { TypeStand } from "./TypeStand";
export class Stand {
    id!: number;
    zone!: TypeStand;
    reserved!: boolean;
    number!: number;
    statut!: boolean;
    pack!: Pack;
}
