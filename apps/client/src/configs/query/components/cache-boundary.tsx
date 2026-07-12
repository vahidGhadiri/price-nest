import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import type { PropsWithChildren } from 'react';

import { getClient } from '@configs';

interface CacheBoundaryProps {
    state: (client: QueryClient) => Promise<void>;
}

export default async function CacheBoundary({ children, state }: PropsWithChildren<CacheBoundaryProps>) {
    const client = getClient();

    try {
        await state(client);
    } catch {
        // Prefetch failed — children will fetch on the client side
    }

    return <HydrationBoundary state={dehydrate(client)}>{children}</HydrationBoundary>;
}
