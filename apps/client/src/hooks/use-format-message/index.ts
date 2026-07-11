import { useTranslations, useLocale } from 'next-intl';

import type { MessageDefinition } from '@configs/i18n';

function useFormatMessage() {
    const t = useTranslations();
    const locale = useLocale();

    const formatMessage = (entry: MessageDefinition): string => {
        const { defaultMessage, id } = entry;

        try {
            const translatedFromNextIntl = t(id);
            if (translatedFromNextIntl && translatedFromNextIntl !== id) {
                return translatedFromNextIntl;
            }
        } catch {}

        const currentText = defaultMessage[locale as keyof typeof defaultMessage];
        if (currentText?.trim()) {
            return currentText.trim();
        }

        if (defaultMessage.en?.trim()) {
            return defaultMessage.en.trim();
        }

        return id;
    };

    return { formatMessage };
}

export default useFormatMessage;
