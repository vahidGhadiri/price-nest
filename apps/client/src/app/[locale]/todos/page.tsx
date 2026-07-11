import { setRequestLocale } from 'next-intl/server';

import { prefetchTodos } from '@adapters/todos';
import { CacheBoundary } from '@configs';

import TodoList from './todo-list';

interface TodosPageProps {
    params: Promise<{
        locale: string;
    }>;
}

export default async function TodosPage({ params }: TodosPageProps) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <CacheBoundary state={(client) => prefetchTodos(client)}>
            <TodoList />
        </CacheBoundary>
    );
}
