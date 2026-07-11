'use client';
import { QueryClientProvider } from '@tanstack/react-query';
import type { PropsWithChildren } from 'react';
import { useState } from 'react';

import { createCacheClient } from '../utils/create-cache-client';

export default function CacheProvider({ children }: PropsWithChildren) {
    const [client] = useState(createCacheClient);

    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
