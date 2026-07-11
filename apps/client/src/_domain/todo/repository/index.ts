import type { IHttp } from '@contracts/http';

import type { CreateTodoDto, Todo } from '../data-transfer-object';
import type { DomainServices } from '../domain-services';

export interface ITodoRepository {
    createTodo: (dto: CreateTodoDto) => Promise<Todo>;
    getTodo: (id: number) => Promise<Todo>;
    getTodos: () => Promise<Todo[]>;
}

export default class TodoRepository implements ITodoRepository {
    private http: IHttp<DomainServices>;

    constructor(http: IHttp<DomainServices>) {
        this.http = http;
    }

    public createTodo: ITodoRepository['createTodo'] = (dto) => {
        return this.http.request({
            serviceName: 'CREATE_TODO',
            requestBody: dto,
            method: 'POST',
        });
    };

    public getTodo: ITodoRepository['getTodo'] = (id) => {
        return this.http.request({
            serviceName: 'GET_TODO',
            pathParams: { id },
            method: 'GET',
        });
    };

    public getTodos: ITodoRepository['getTodos'] = () => {
        return this.http.request({
            serviceName: 'GET_TODOS',
            method: 'GET',
        });
    };
}
