import { Area } from "./area";
import { Audit } from "./audit";

export class Structure extends Audit {
    name?: string;
    description?: string;
    areas?: Area[]
}

