export interface AuthUser {
    rights: string[];
    user: AppUser;
}

export type AppUser = {
    id: string;
    username: string;
    fullName: string;
    isSupper: boolean;
    emailAddress: string;
    phoneNumber?: string;
    amount?: number;
}

export interface LoginParams {
    username: string;
    password: string;
    rememberMe: boolean;
}

export interface NewUser {
    username: string;
    password: string;
    fullName: string;
}
