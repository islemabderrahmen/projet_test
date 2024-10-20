import { Devis } from "./devis";
import { Forum } from "./forum";
import { Individu } from "./individus";
import { Invoice } from "./invoice";

export class RequestSupply {
    idRequestSupply!: number;
    quantity!: number;
    category!: string;
    description!: string;
    date!: Date;
    validity!: number;
    status!: String;
    devis!: Devis[];
    invoice!: Invoice;
    individu!: Individu;
    forum!:Forum;
    RequestSuplyStatus!: string;
}