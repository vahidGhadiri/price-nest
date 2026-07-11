import '@configs/tailwind/index.css';

import type { ReactNode } from 'react';
import type { Metadata } from 'next';

import { CacheProvider } from '@configs';

interface RootLayoutProps {
    children: ReactNode;
}

export const metadata: Metadata = {
    description: 'Intelligent price monitoring and tracking platform',
    title: 'Price Nest',
};

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="en">
            <body>
                <CacheProvider>{children}</CacheProvider>
            </body>
        </html>
    );
}
