'use client';

import { Suspense, useState } from 'react';

import { useGetTodosSuspense, useCreateTodo } from '@adapters/todos';
import { FormattedMessage } from '@components';
import { useFormatMessage } from '@hooks';

import strings from './strings';

function TodoListContent() {
    const { data: todos } = useGetTodosSuspense();
    const { formatMessage } = useFormatMessage();
    const [title, setTitle] = useState('');
    const createTodo = useCreateTodo();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) return;

        createTodo.mutate(title, {
            onSuccess: () => setTitle(''),
        });
    };

    return (
        <main className="mx-auto flex min-h-dvh max-w-lg flex-col gap-8 p-8 pt-16">
            <div className="flex flex-col gap-2">
                <FormattedMessage className="text-3xl font-bold tracking-tight text-foreground" message={strings.title} tag="h1" />
                <FormattedMessage className="text-sm text-muted-foreground" message={strings.description} tag="p" />
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    className="flex-1 rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder={formatMessage(strings.placeholder)}
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                    type="text"
                />
                <button
                    className="rounded-lg bg-primary px-10 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={createTodo.isPending}
                    type="submit">
                    {createTodo.isPending ? formatMessage(strings.adding) : formatMessage(strings.add)}
                </button>
            </form>

            <ul className="flex flex-col gap-1">
                {todos.map((todo) => (
                    <li className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3" key={todo.id}>
                        <div
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                                todo.completed ? 'border-success bg-success text-white' : 'border-input'
                            }`}>
                            {todo.completed && (
                                <svg stroke="currentColor" className="h-3 w-3" viewBox="0 0 24 24" strokeWidth="2" fill="none">
                                    <path strokeLinejoin="round" strokeLinecap="round" d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </div>
                        <span className={`text-sm ${todo.completed ? 'text-muted-foreground line-through' : 'text-card-foreground'}`}>{todo.title}</span>
                    </li>
                ))}
            </ul>

            {todos.length === 0 && <FormattedMessage className="py-12 text-center text-sm text-muted-foreground" message={strings.empty} tag="p" />}
        </main>
    );
}

function TodoListFallback() {
    return (
        <main className="mx-auto flex min-h-dvh max-w-lg flex-col gap-8 p-8 pt-16">
            <div className="flex flex-col gap-2">
                <FormattedMessage className="text-3xl font-bold tracking-tight text-foreground" message={strings.title} tag="h1" />
                <FormattedMessage className="text-sm text-muted-foreground" message={strings.description} tag="p" />
            </div>
            <div className="flex gap-2">
                <div className="h-10 flex-1 animate-pulse rounded-lg bg-muted" />
                <div className="h-10 w-20 animate-pulse rounded-lg bg-muted" />
            </div>
            <div className="flex flex-col gap-1">
                {[1, 2, 3].map((i) => (
                    <div className="h-12 animate-pulse rounded-lg bg-muted" key={i} />
                ))}
            </div>
        </main>
    );
}

export default function TodoList() {
    return (
        <Suspense fallback={<TodoListFallback />}>
            <TodoListContent />
        </Suspense>
    );
}
