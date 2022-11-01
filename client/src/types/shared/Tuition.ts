import { Identifier } from '.';

export interface ITuition {
    id: Identifier;
    userId: Identifier;
    userName: string;
    userPaymentName: string;
    subject: string;
    userCode: string;
    tuitionCode: string;
    totalFee: number;
    status: string;
    semester: string;
    startDate: Date;
    endDate: Date;
    expiredAt: Date;
    updatedAt: Date;
}