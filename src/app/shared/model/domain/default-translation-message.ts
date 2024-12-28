import { BaseEntity } from "./base-entity";

export class DefaultTranslationMessage extends BaseEntity {
    language?: string;
    isDefault?: boolean;
    message?: string;
}

