import { Audit } from "./audit";
import { NotificationTranslation } from "./notification-translation";

export class NotificationCode extends Audit {
    title?: string;
    code?: string;
    translations?: NotificationTranslation[];
}

