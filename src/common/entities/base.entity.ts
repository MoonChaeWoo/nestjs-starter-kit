import {CreateDateColumn, DeleteDateColumn, UpdateDateColumn} from "typeorm";

export abstract class BaseEntity {
    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deletedAt?: Date;
}