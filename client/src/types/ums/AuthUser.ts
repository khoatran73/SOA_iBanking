export interface AuthUser {
    rights: string[];
    user: AppUser;
    token: string;
}

export interface AppUser {
    id: string;
    userName: string;
    fullName: string;
    isSupper: boolean;
    email: string;
    phoneNumber?: string;
    orgId?: string;
}

export interface LoginParam {
    userName: string;
    password: string;
    rememberMe: boolean;
}
