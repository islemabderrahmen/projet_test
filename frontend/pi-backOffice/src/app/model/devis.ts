import { RequestSupply } from "./requestSupply";
import {Society} from "./society";
export class Devis {
    id!: number;
    price!: number;
    quantity!: number;
    description!: string;
    file!: string;
    status!: String;
    requestSupply!: RequestSupply;
    society!: Society;
}