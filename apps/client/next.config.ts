import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    reactStrictMode: true,
};

const withNextIntl = createNextIntlPlugin('./src/configs/i18n/helpers/request.ts');

export default withNextIntl(nextConfig);
