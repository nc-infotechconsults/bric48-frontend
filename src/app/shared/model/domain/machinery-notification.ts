import { BaseEntity } from "./base-entity";
import { Machinery } from "./machinery";

export class MachineryNotification extends BaseEntity {
    type?: string;
    value?: string;
    description?: string;
    machinery?: Machinery;
    solved?: boolean;
    createdAt?: Date;
}

