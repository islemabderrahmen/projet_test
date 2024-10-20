import { RequestSupply } from "./requestSupply";

export class Invoice {
    idInvoice!: number;
    description!: string;
    file!: string;
    status!: string;
    comment!: string;
    requestSupply!: RequestSupply;
}