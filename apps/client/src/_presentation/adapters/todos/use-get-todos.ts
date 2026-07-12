import { useSuspenseQuery, queryOptions, useQuery } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';

import todoDomainProvider from '@domain/todo';

export interface TodoFilters {
    completed?: boolean;
}

const key = (filters?: TodoFilters) => ['todos', 'list', filters ?? {}] as const;

const options = (filters?: TodoFilters) =>
    queryOptions({
        queryFn: () => todoDomainProvider().getTodos(),
        queryKey: key(filters),
    });

export function useGetTodos(filters?: TodoFilters) {
    return useQuery(options(filters));
}

export function useGetTodosSuspense(filters?: TodoFilters) {
    return useSuspenseQuery(options(filters));
}

export async function prefetchTodos(queryClient: QueryClient, filters?: TodoFilters) {
    return queryClient.prefetchQuery(options(filters));
}
