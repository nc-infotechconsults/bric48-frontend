import { BaseEntity } from "./base-entity";
import { User } from "./user";

export class Message extends BaseEntity {
    message?: string;
    language?: string;
    sender?: User;
    receiver?: User;
    sentAt?: Date;
}

