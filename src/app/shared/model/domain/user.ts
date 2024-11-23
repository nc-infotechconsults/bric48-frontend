import { Audit } from "./audit";
import { Headphone } from "./headphone";
import { Machinery } from "./machinery";
import { Role } from "./role";

export class User extends Audit {
    name?: string;
    surname?: string;
    email?: string;
    regNumber?: string;
    phoneNumber?: string;
    role?: Role;
    headphone?: Headphone;
    machineries?: Machinery[];
}

