import '@configs/tailwind/index.css';

import { setRequestLocale, getMessages } from 'next-intl/server';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';

import { routing } from '@configs/i18n/helpers/routing';
import { CacheProvider } from '@configs';

interface RootLayoutProps {
    params: Promise<{
        locale: string;
    }>;
    children: ReactNode;
}

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
    description: 'Intelligent price monitoring and tracking platform',
    title: 'Price Nest',
};

export default async function RootLayout({ children, params }: RootLayoutProps) {
    const { locale } = await params;

    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }

    setRequestLocale(locale);

    const messages = await getMessages();

    return (
        <html dir={locale === 'fa' ? 'rtl' : 'ltr'} lang={locale}>
            <body>
                <NextIntlClientProvider messages={messages}>
                    <CacheProvider>{children}</CacheProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
