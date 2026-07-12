import type { CreateTodoDto, Todo } from '../data-transfer-object';
import type { ITodoRepository } from '../repository';

export interface ITodoUsecase {
    createTodo: (dto: CreateTodoDto) => Promise<Todo>;
    getTodo: (id: number) => Promise<Todo>;
    getTodos: () => Promise<Todo[]>;
}

export default class TodoUsecase implements ITodoUsecase {
    private todoRepository: ITodoRepository;

    constructor(todoRepository: ITodoRepository) {
        this.todoRepository = todoRepository;
    }

    public createTodo: ITodoUsecase['createTodo'] = (dto) => {
        return this.todoRepository.createTodo(dto);
    };

    public getTodo: ITodoUsecase['getTodo'] = (id) => {
        return this.todoRepository.getTodo(id);
    };

    public getTodos: ITodoUsecase['getTodos'] = () => {
        return this.todoRepository.getTodos();
    };
}
