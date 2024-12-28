import { Audit } from "./audit";
import { DefaultTranslationMessage } from "./default-translation-message";

export class DefaultMessage extends Audit {
    title?: string;
    translations?: DefaultTranslationMessage[];
}

