import {BeforeInsert, PrimaryColumn} from "typeorm";
import { Snowflake } from '@theinternetfolks/snowflake';

export abstract class BaseSnowflakeEntity {
    @PrimaryColumn('bigint')
    uid: string; // 숫자를 문자열로 저장하면 안전

    @BeforeInsert()
    generateUid() {
        this.uid = Snowflake.generate();
    }
}