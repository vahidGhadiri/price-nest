export interface IQueryBuilder {
    toAbsoluteUrl: (path: string, baseOrigin?: string) => string;
    buildPath: (...parts: string[]) => string;
    build: (args: BuildParams) => string;
}

export interface BuildParams {
    query?: Record<string, QueryValueType> | string;
    pathParams?: PathParams;
    serviceEndpoint: string;
    baseUrl?: string;
}

const REMOVE_SURPLUS_SLASHES_REGEX = /^\/+|\/+$/g;

export default class QueryBuilder implements IQueryBuilder {
    public build({ serviceEndpoint, pathParams, baseUrl, query }: BuildParams): string {
        if (!serviceEndpoint?.trim()) throw new Error('Service endpoint cannot be empty');
        if (!baseUrl?.trim()) throw new Error('Base URL cannot be empty');

        let servicePath = serviceEndpoint;
        let queryParams = '';

        if (pathParams) {
            Object.entries(pathParams).forEach(([key, value]) => {
                if (!key?.trim()) throw new Error('Path parameter key cannot be empty');
                servicePath = servicePath.replace(`:${key}`, encodeURIComponent(String(value)));
            });
        }

        if (typeof query === 'string' && query.trim()) {
            queryParams = `/${query}`;
        } else if (typeof query === 'object' && query !== null) {
            queryParams = this.buildQueryParams(query);
        }

        return this.toAbsoluteUrl(this.buildPath(baseUrl, servicePath) + queryParams);
    }

    public toAbsoluteUrl(path: string, baseOrigin = this.getCurrentOrigin()): string {
        try {
            return new URL(path).toString();
        } catch {
            return new URL(path, baseOrigin).toString();
        }
    }

    public buildPath(...parts: string[]): string {
        return parts
            .map((part) => part?.trim().replace(REMOVE_SURPLUS_SLASHES_REGEX, ''))
            .filter((part) => part)
            .join('/');
    }

    private buildQueryParams(query: Record<string, QueryValueType>): string {
        const params = new URLSearchParams();
        Object.entries(query).forEach(([key, value]) => {
            if (key?.trim() && value != null) {
                if (Array.isArray(value)) {
                    value.forEach((item) => params.append(key, String(item)));
                } else {
                    params.set(key, String(value));
                }
            }
        });
        return params.toString() ? `?${params.toString()}` : '';
    }

    private getCurrentOrigin(): string {
        if (typeof globalThis.location?.origin === 'string' && globalThis.location.origin.trim()) {
            return globalThis.location.origin;
        }

        return 'http://localhost';
    }
}
