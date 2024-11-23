import { Audit } from "./audit";
import { User } from "./user";

export class Headphone extends Audit {
    name?: string;
    serial?: string;
    user?: User;
}

