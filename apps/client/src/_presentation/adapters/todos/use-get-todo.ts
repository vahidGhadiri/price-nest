import { useSuspenseQuery, queryOptions, useQuery } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';

import todoDomainProvider from '@domain/todo';

const key = (id: number) => ['todos', 'detail', id] as const;

const options = (id: number) =>
    queryOptions({
        queryFn: () => todoDomainProvider().getTodo(id),
        queryKey: key(id),
    });

export function useGetTodo(id: number) {
    return useQuery(options(id));
}

export function useGetTodoSuspense(id: number) {
    return useSuspenseQuery(options(id));
}

export async function prefetchTodo(queryClient: QueryClient, id: number) {
    return queryClient.prefetchQuery(options(id));
}
