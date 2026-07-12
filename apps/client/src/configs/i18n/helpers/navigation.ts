import { createNavigation } from 'next-intl/navigation';

import { routing } from './routing';

export const { usePathname, getPathname, useRouter, redirect, Link } = createNavigation(routing);
