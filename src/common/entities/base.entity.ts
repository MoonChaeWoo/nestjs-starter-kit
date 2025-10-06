import {CreateDateColumn, DeleteDateColumn, UpdateDateColumn} from "typeorm";

export abstract class BaseEntity {
    @CreateDateColumn({comment: '데이터 생성 일시 (자동 기록)'})
    createdAt: Date;

    @UpdateDateColumn({comment: '데이터 최종 수정 일시 (자동 갱신)'})
    updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true, comment: '데이터 삭제 일시 (Soft Delete 시 자동 기록)'})
    deletedAt?: Date;
}