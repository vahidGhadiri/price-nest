import { useQueryClient, useMutation } from '@tanstack/react-query';

import todoDomainProvider from '@domain/todo';

const key = ['todos'] as const;

export function useCreateTodo() {
    const queryClient = useQueryClient();

    return useMutation({
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: key });
        },
        mutationFn: (title: string) => todoDomainProvider().createTodo({ title }),
    });
}
