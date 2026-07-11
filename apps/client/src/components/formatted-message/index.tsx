import { FormattedMessage as IntlFormattedMessage } from 'react-intl';
import type { ReactNode, JSX, FC } from 'react';

type Primitive = ReactNode | string | number;

export interface FormattedMessageProps {
    children?: (nodes: ReactNode[]) => ReactNode;
    tag?: keyof JSX.IntrinsicElements;
    values?: FormattedMessageValues;
    dir?: 'auto' | 'rtl' | 'ltr';
    defaultMessage: string;
    className?: string;
    id: string;
}

export interface FormattedMessageValues extends Record<string, Primitive> {
    className?: string;
}

const wrapValuesWithClassName = (values?: FormattedMessageValues, dir?: FormattedMessageProps['dir']): Record<string, Primitive> | undefined => {
    if (!values) return values;

    const { className, ...rest } = values;

    if (!className && !dir) return rest;

    return Object.fromEntries(
        Object.entries(rest).map(([key, value]) => [
            key,
            <bdi dir={dir ? 'auto' : undefined} className={className} key={key}>
                {value}
            </bdi>,
        ])
    );
};

export const FormattedMessage: FC<FormattedMessageProps> = ({ tag: Tag = 'p', defaultMessage, className, children, values, dir, id }) => {
    const processedValues = wrapValuesWithClassName(values, dir);

    return (
        <Tag className={className} dir={dir}>
            <IntlFormattedMessage defaultMessage={defaultMessage} values={processedValues} id={id}>
                {children ? children : (nodes: ReactNode[]) => nodes}
            </IntlFormattedMessage>
        </Tag>
    );
};

export default FormattedMessage;
