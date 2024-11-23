import { Audit } from "./audit";
import { Machinery } from "./machinery";
import { Structure } from "./structure";

export class Area extends Audit {
    name?: string;
    description?: string;
    structure?: Structure;
    machineries?: Machinery[];
}

