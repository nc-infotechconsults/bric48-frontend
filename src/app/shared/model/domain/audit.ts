import { BaseEntity } from './base-entity';

export abstract class Audit extends BaseEntity {
    createdBy?: string;
    createdAt?: Date;
    updatedBy?: string;
    updatedAt?: Date;
    deletedBy?: string;
    deletedAt?: Date;
}
