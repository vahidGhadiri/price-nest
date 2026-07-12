export interface Todo {
    completed: boolean;
    createdAt: string;
    title: string;
    id: number;
}

export interface CreateTodoDto {
    title: string;
}
