import type { IKookie } from '@contracts';

import { Guard } from '@infrastructure/gaurds';

export default class Kookie implements IKookie {
    setCookie: IKookie['setCookie'] = ({ options = {}, value, name }): void => {
        Guard.against(name, 'Cookie name').undefined().null().empty();

        const parts = [`${encodeURIComponent(name)}=${encodeURIComponent(value)}`];

        if (options.expires) {
            parts.push(`expires=${options.expires.toUTCString()}`);
        }

        if (options.maxAge !== undefined) {
            parts.push(`max-age=${options.maxAge}`);
        }

        if (options.path) {
            parts.push(`path=${options.path}`);
        } else {
            parts.push(`path=/`);
        }

        if (options.domain) {
            parts.push(`domain=${options.domain}`);
        }

        if (options.secure) {
            parts.push(`secure`);
        }

        if (options.sameSite) {
            parts.push(`samesite=${options.sameSite}`);
        } else {
            parts.push(`samesite=Lax`);
        }

        if (options.httpOnly) {
            parts.push(`HttpOnly`);
        }

        document.cookie = parts.join('; ');
    };

    getCookie: IKookie['getCookie'] = ({ name }): string | null => {
        Guard.against(name, 'Cookie name').undefined().null().empty();

        const cookies = document.cookie ? document.cookie.split(/;\s*/) : [];
        for (const cookie of cookies) {
            const [key, value] = cookie.split('=');
            if (key && decodeURIComponent(key.trim()) === decodeURIComponent(name)) {
                return value ? decodeURIComponent(value.trim()) : null;
            }
        }
        return null;
    };

    deleteCookie: IKookie['deleteCookie'] = ({ path = '/', domain, name }): void => {
        this.setCookie({ options: { maxAge: -1, domain, path }, value: '', name });
    };
}

const kookie = new Kookie();

export { kookie };
