import { prefetchTodos } from '@adapters/todos';
import { CacheBoundary } from '@configs';

import TodoList from './todo-list';

export default async function TodosPage() {
    return (
        <CacheBoundary state={(client) => prefetchTodos(client)}>
            <TodoList />
        </CacheBoundary>
    );
}
