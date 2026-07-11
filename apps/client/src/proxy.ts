import createMiddleware from 'next-intl/middleware';

import { routing } from '@configs/i18n/helpers/routing';

export default createMiddleware(routing);

export const config = {
    matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
