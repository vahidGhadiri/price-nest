'use client';

import type { ReactNode, JSX, FC } from 'react';

import type { MessageDefinition } from '@configs/i18n';
import { useFormatMessage } from '@hooks';

export interface FormattedMessageProps {
    children?: (text: string) => ReactNode;
    tag?: keyof JSX.IntrinsicElements;
    dir?: 'auto' | 'rtl' | 'ltr';
    message: MessageDefinition;
    className?: string;
}

export const FormattedMessage: FC<FormattedMessageProps> = ({ tag: Tag = 'p', className, children, message, dir }) => {
    const { formatMessage } = useFormatMessage();
    const rendered = formatMessage(message);

    return (
        <Tag className={className} dir={dir}>
            {children ? children(rendered) : rendered}
        </Tag>
    );
};

export default FormattedMessage;
