import { BaseEntity } from "./base-entity";

export class NotificationTranslation extends BaseEntity {
    language?: string;
    isDefault?: boolean;
    message?: string;
}

