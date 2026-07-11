import { createCacheClient } from './utils/create-cache-client';

const cacheClient = createCacheClient();

export const DEFAULT_STALE_TIME = 300_000;

export { default as CacheBoundary } from './components/cache-boundary';
export { default as CacheProvider } from './components/cache-provider';
export { createCacheClient } from './utils/create-cache-client';
export { getClient } from './utils/get-client';
export default cacheClient;
