import { Audit } from "./audit";
import { NotificationTranslation } from "./notification-translation";

export class NotificationCode extends Audit {
    title?: string;
    type?: string;
    value?: string;
    translations?: NotificationTranslation[];
}

