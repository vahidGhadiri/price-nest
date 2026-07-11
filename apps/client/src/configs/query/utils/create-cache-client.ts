import { QueryClient } from '@tanstack/react-query';

export function createCacheClient(): QueryClient {
    return new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
                staleTime: 1000 * 60 * 5,
                gcTime: 1000 * 60 * 5,
                networkMode: 'always',
                retryOnMount: true,
                retry: 2,
            },
        },
    });
}
