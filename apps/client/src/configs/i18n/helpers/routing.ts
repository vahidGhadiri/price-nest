import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
    localePrefix: 'as-needed',
    locales: ['fa', 'en', 'ar'],
    defaultLocale: 'fa',
});
