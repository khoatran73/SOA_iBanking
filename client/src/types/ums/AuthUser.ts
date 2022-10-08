export interface AuthUser {
    rights: string[];
    user: AppUser;
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

export interface LoginParams {
    username: string;
    password: string;
    rememberMe: boolean;
}
