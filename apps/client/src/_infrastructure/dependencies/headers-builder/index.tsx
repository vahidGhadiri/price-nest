import { Guard } from '@/_infrastructure/gaurds';

export interface HeadersBuilderInterface {
    addIf(condition: boolean, key: string, value: undefined | string | null): this;
    merge(headers: Record<string, undefined | string | null>): this;
    add(key: string, value: undefined | string | null): this;
    override(key: string, value: string): this;
    get(key: string): undefined | string;
    build(): Record<string, string>;
    remove(key: string): this;
    has(key: string): boolean;
    toHeaders(): Headers;
    reset(): this;
}

const VALIDATION_HEADERS_REGEX = /^[a-zA-Z0-9-]+$/;

export default class HeadersBuilder implements HeadersBuilderInterface {
    private headers: Record<string, string> = {};

    merge(headers: Record<string, undefined | string | null> | undefined): this {
        if (!headers) return this;

        for (const [key, value] of Object.entries(headers)) {
            try {
                this.add(key, value);
            } catch (error) {
                void error;
            }
        }
        return this;
    }

    public toHeaders(): Headers {
        const headers = new Headers();
        for (const [key, value] of Object.entries(this.headers)) {
            headers.set(key, value);
        }
        return headers;
    }

    public add(key: string, value: undefined | string | null): this {
        this.validateKey(key);
        if (value != null) {
            this.headers[key] = value;
        }
        return this;
    }

    public addIf(condition: boolean, key: string, value: undefined | string | null): this {
        if (condition) {
            this.add(key, value);
        }
        return this;
    }

    public override(key: string, value: string): this {
        this.headers[key] = value;
        return this;
    }

    public remove(key: string): this {
        delete this.headers[key];
        return this;
    }

    public get(key: string): undefined | string {
        return this.headers[key];
    }

    public build(): Record<string, string> {
        return { ...this.headers };
    }

    public has(key: string): boolean {
        return key in this.headers;
    }

    public reset(): this {
        this.headers = {};
        return this;
    }

    private validateKey(key: string): void {
        Guard.against(key, 'Header key').undefined().null().empty();

        if (!VALIDATION_HEADERS_REGEX.test(key)) {
            throw new Error(`Invalid header key: ${key}`);
        }
    }
}
