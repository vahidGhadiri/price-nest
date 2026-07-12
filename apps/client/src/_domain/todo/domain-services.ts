export type DomainServices = typeof domainServices;

export const domainServices = {
    GET_TODO: '/api/todos/:id',
    CREATE_TODO: '/api/todos',
    GET_TODOS: '/api/todos',
} as const;
