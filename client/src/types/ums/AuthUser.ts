export interface AuthUser {
    rights: string[];
    user: AppUser;
    token: string;
}

export interface AppUser {
    id: string;
    username: string;
    fullName?: string;
    isSupper: boolean;
    email: string;
    phoneNumber?: string;
    orgId?: string;
    userCode?: string;
    amount?: number;
}

export interface LoginParam {
    username: string;
    password: string;
    rememberMe: boolean;
}
