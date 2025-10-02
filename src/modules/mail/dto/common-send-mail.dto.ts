import type { Address } from 'nodemailer';
import type { Attachment } from 'nodemailer/lib/mailer';
import type * as DKIM from 'nodemailer/lib/dkim';
import type { TextEncoding } from 'nodemailer/lib/mime-funcs';
import {IsOptional, IsString, IsDate, ValidateNested, IsNotEmpty} from 'class-validator';

export class CommonSendMailDto {
    /** 참조 수신자. 다른 수신자에게 공개됨 */
    @IsOptional()
    cc?: string | Address | Array<string | Address>;

    /** 메일 발송 일시 */
    @IsOptional()
    @IsDate()
    date?: Date | string;

    /** DKIM 서명 옵션 */
    @IsOptional()
    dkim?: DKIM.Options;

    /** 전체 메시지 인코딩 */
    @IsOptional()
    encoding?: string;

    /** 발신자 이메일. "이름" <email> 형식 가능 */
    @IsOptional()
    from?: string | Address;

    /** 커스텀 헤더 설정 */
    @IsOptional()
    headers?: Record<string, string>;

    /** 기존 메일 Message-ID 참조. 메일 스레드 관리용 */
    @IsOptional()
    inReplyTo?: string | Address;

    /** 이미 완성된 RFC 822 메일 원문 */
    @IsOptional()
    raw?: string | Buffer;

    /** 스레드 관련 Message-ID 참조 */
    @IsOptional()
    references?: string | string[];

    /** 회신 주소. replyTo로 지정하면 답장 시 이 주소로 감 */
    @IsOptional()
    replyTo?: string | Address | Array<string | Address>;

    /** 메일 발송자 실제 sender 주소 */
    @IsOptional()
    sender?: string | Address;

    /** 메일 제목. 권장 필수 */
    @IsOptional()
    @IsString()
    subject?: string;

    /** text 인코딩 설정 (base64, quoted-printable 등) */
    @IsOptional()
    textEncoding?: TextEncoding;

    /** 수신자 이메일. 문자열, Address 객체, 또는 배열 가능. 필수 */
    @IsNotEmpty()
    to: string | Address | Array<string | Address>;

    /** 다중 transporter 사용 시 이름 지정 */
    @IsOptional()
    @IsString()
    transporterName?: string;
}