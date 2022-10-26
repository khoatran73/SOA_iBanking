import { Identifier } from '.';
import { AppUser } from '../ums/AuthUser';
export interface ITuition {
    id: Identifier;
    user: AppUser;
    userPayment: AppUser;
    subject: string;
    tuitionCode: string;
    totalFee: number;
    status: string;
    startDate: Date;
    endDate: Date;
    expiredAt: Date;
}