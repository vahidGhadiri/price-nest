import type { routing } from './helpers/routing';

type Locales = (typeof routing)['locales'][number];

type MessageDefinition = {
    defaultMessage: Record<Locales, string>;
    id: string;
};

type Messages = Record<string, MessageDefinition>;

export function defineMessages<T extends Messages>(messages: T): T {
    return messages;
}

export type { MessageDefinition, Messages, Locales };
