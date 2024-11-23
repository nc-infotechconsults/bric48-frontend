import { Area } from "./area";
import { Audit } from "./audit";
import { Beacon } from "./beacon";
import { User } from "./user";

export class Machinery extends Audit {
    name?: string;
    serial?: string;
    description?: string;
    beacons?: Beacon[];
    area: Area;
    users: User[];
}

