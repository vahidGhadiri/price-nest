import { createCacheClient } from './create-cache-client';

let browserClient: ReturnType<typeof createCacheClient> | undefined;

export function getClient() {
    if (typeof window === 'undefined') {
        return createCacheClient();
    }

    if (!browserClient) {
        browserClient = createCacheClient();
    }

    return browserClient;
}
