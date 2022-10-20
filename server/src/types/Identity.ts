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
    userName: string;
    password: string;
    rememberMe: boolean;
}

export interface NewUser {
    userName: string;
    password: string;
    fullName: string;
}
