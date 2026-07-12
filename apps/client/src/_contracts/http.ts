type RequestMethod = 'DELETE' | 'PATCH' | 'POST' | 'GET' | 'PUT';

type InternalResponseType = 'arrayBuffer' | 'text' | 'blob' | 'json';

type HeaderRecord = Record<string, undefined | string | null>;

export type RequestFor<DomainService, ServiceName extends keyof DomainService> = Omit<RequestParams<DomainService>, 'serviceName'> & {
    serviceName: ServiceName;
};

export interface GeneralDomainService {
    [key: string]: string;
}

export interface HttpOptions {
    responseType?: InternalResponseType;
    headers?: HeaderRecord;
    isMultipart?: boolean;
    cache: RequestCache;
    timeout?: number;
    baseUrl: string;
}

export interface RequestParams<DomainService> {
    pathParams?: Record<string, string | number>;
    serviceName: keyof DomainService;
    method: RequestMethod;
    requestBody?: unknown;
    query?: QueryParams;
}

export interface IHttp<DomainService extends GeneralDomainService> {
    request<ServiceName extends keyof DomainService, TResponse = unknown>(
        params: RequestFor<DomainService, ServiceName>,
        requestOptions?: Partial<HttpOptions>
    ): Promise<TResponse>;
}
