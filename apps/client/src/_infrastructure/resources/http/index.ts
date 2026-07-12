import type { GeneralDomainService, RequestParams, HttpOptions, RequestFor, IHttp } from '@contracts';

import ErrorBuilder, { MAXIMUM_REQUEST_LATENCY } from '../../dependencies/error-builder';
import ResponseBuilder from '../../dependencies/response-builder';
import HeadersBuilder from '../../dependencies/headers-builder';
import QueryBuilder from '../../dependencies/query-builder';

type HttpRequestInit = RequestInit;

interface BuildUrlParams<DomainService> {
    params: RequestParams<DomainService>;
    queryBuilder: QueryBuilder;
    baseUrl: string;
}

interface CreateRequestConfigParams {
    headersBuilder: HeadersBuilder;
    isMultipart?: boolean;
    requestBody: unknown;
    signal: AbortSignal;
    method: string;
}

const DEFAULT_HTTP_OPTIONS: HttpOptions = {
    headers: { 'Content-Type': 'application/json' },
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL ?? '',
    timeout: MAXIMUM_REQUEST_LATENCY,
    responseType: 'json',
    cache: 'no-cache',
};

class Http<DomainService extends GeneralDomainService> implements IHttp<DomainService> {
    constructor(private readonly domainService: DomainService) {}

    public async request<ServiceName extends keyof DomainService, TResponse = unknown>(
        params: RequestFor<DomainService, ServiceName>,
        requestOptions: Partial<HttpOptions> = {}
    ): Promise<TResponse> {
        const responseBuilder = new ResponseBuilder();
        const headersBuilder = new HeadersBuilder();
        const controller = new AbortController();
        const queryBuilder = new QueryBuilder();

        const mergedOptions: HttpOptions = {
            ...DEFAULT_HTTP_OPTIONS,
            ...requestOptions,
            headers: { ...DEFAULT_HTTP_OPTIONS.headers, ...requestOptions.headers },
        };

        const timeoutId = setTimeout(() => controller.abort(), mergedOptions.timeout);

        try {
            headersBuilder.reset();
            headersBuilder.merge({ 'Content-Type': 'application/json' });
            headersBuilder.merge(mergedOptions.headers);

            const url = this.buildUrl({
                baseUrl: mergedOptions.baseUrl,
                queryBuilder,
                params,
            });

            const requestConfig = this.createRequestConfig({
                isMultipart: requestOptions.isMultipart,
                requestBody: params.requestBody,
                signal: controller.signal,
                method: params.method,
                headersBuilder,
            });

            const response = await fetch(url, requestConfig);

            if (!response) {
                throw ErrorBuilder.ErrorResponses.RequestTimeout();
            }

            if (!response.ok) {
                throw ErrorBuilder.fromClientError(response);
            }

            const responseBody = await this.parseResponse(response, mergedOptions.responseType ?? 'json');
            const builtResponse = responseBuilder.build<TResponse>(responseBody);

            if (!builtResponse.success) {
                throw ErrorBuilder.fromClientError(builtResponse.error);
            }

            return builtResponse.data as TResponse;
        } catch (error) {
            throw error instanceof Error ? ErrorBuilder.fromClientError(error) : error;
        } finally {
            clearTimeout(timeoutId);
        }
    }

    private createRequestConfig({ headersBuilder, isMultipart, requestBody, signal, method }: CreateRequestConfigParams): HttpRequestInit {
        const shouldHaveBody = requestBody && ['PATCH', 'POST', 'PUT'].includes(method);
        const headers = { ...headersBuilder.build() };

        const config: HttpRequestInit = {
            headers,
            method,
            signal,
        };

        if (!shouldHaveBody) {
            return config;
        }

        if (isMultipart) {
            config.body = this.createFormData(requestBody);
            delete headers['Content-Type'];
        } else {
            config.body = JSON.stringify(requestBody);
            headers['Content-Type'] = 'application/json';
        }

        return config;
    }

    private async parseResponse(response: Response, responseType: string): Promise<unknown> {
        const parserMap: Record<string, () => Promise<unknown>> = {
            arrayBuffer: () => response.arrayBuffer(),
            json: () => this.parseJsonBody(response),
            blob: () => response.blob(),
            text: () => response.text(),
        };

        return parserMap[responseType]();
    }

    private createFormData(requestBody: unknown): FormData {
        if (requestBody instanceof FormData) return requestBody;

        const formData = new FormData();

        Object.entries(requestBody as Record<string, boolean | number | string | Blob>).forEach(([key, value]) => {
            formData.append(key, value instanceof Blob ? value : String(value));
        });

        return formData;
    }

    private buildUrl({ queryBuilder, baseUrl, params }: BuildUrlParams<DomainService>): string {
        const { serviceName, pathParams, query } = params;

        return queryBuilder.build({
            serviceEndpoint: this.domainService[serviceName],
            pathParams,
            baseUrl,
            query,
        });
    }

    private async parseJsonBody(response: Response): Promise<unknown> {
        const text = await response.text();

        if (!text.trim()) {
            return null;
        }

        return JSON.parse(text);
    }
}

export default Http;

const instances = new WeakMap<GeneralDomainService, IHttp<GeneralDomainService>>();

export function http<DS extends GeneralDomainService>(domainService: DS): IHttp<DS> {
    if (!instances.has(domainService)) {
        instances.set(domainService, new Http(domainService));
    }
    return instances.get(domainService) as IHttp<DS>;
}
