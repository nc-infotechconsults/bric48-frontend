import { Audit } from "./audit";
import { Machinery } from "./machinery";

export class Beacon extends Audit {
    name?: string;
    serial: string;
    threshold: number;
    machinery: Machinery;
}

