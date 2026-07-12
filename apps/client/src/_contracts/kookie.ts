export type SameSiteOptions = 'Strict' | 'None' | 'Lax';

export interface CookieOptions {
    sameSite?: SameSiteOptions;
    httpOnly?: boolean;
    secure?: boolean;
    domain?: string;
    maxAge?: number;
    expires?: Date;
    path?: string;
}

export interface SetCookieParams {
    options?: CookieOptions;
    value: string;
    name: string;
}

export interface DeleteCookieParams {
    domain?: string;
    path?: string;
    name: string;
}

export interface GetCookieParams {
    name: string;
}

export interface IKookie {
    deleteCookie({ domain, name, path }: DeleteCookieParams): void;
    setCookie({ options, value, name }: SetCookieParams): void;
    getCookie({ name }: GetCookieParams): string | null;
}
