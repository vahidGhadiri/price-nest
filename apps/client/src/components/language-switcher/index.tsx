'use client';

import { useEffect, useState, useRef } from 'react';
import { useLocale } from 'next-intl';

import { usePathname, useRouter } from '@configs/i18n/helpers/navigation';
import { routing } from '@configs/i18n/helpers/routing';

const localeLabels: Record<(typeof routing.locales)[number], string> = {
    ar: 'العربية',
    en: 'English',
    fa: 'فارسی',
};

const localeFlags: Record<(typeof routing.locales)[number], string> = {
    ar: '🇸🇦',
    en: '🇬🇧',
    fa: '🇮🇷',
};

export function LanguageSwitcher() {
    const ref = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);
    const pathname = usePathname();
    const locale = useLocale();
    const router = useRouter();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSwitch = (nextLocale: (typeof routing.locales)[number]) => {
        document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000`;
        router.push(pathname, { locale: nextLocale });
        setOpen(false);
    };

    return (
        <div className="relative" ref={ref}>
            <button className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-foreground/5" onClick={() => setOpen(!open)}>
                <span>{localeFlags[locale as (typeof routing.locales)[number]]}</span>
                <span>{localeLabels[locale as (typeof routing.locales)[number]]}</span>
                <svg className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`} stroke="currentColor" viewBox="0 0 24 24" fill="none">
                    <path strokeLinejoin="round" strokeLinecap="round" d="M19 9l-7 7-7-7" strokeWidth={2} />
                </svg>
            </button>

            {open && (
                <div className="absolute  top-full z-50 mt-1  overflow-hidden rounded-lg border bg-background shadow-md">
                    {routing.locales.map((lang) => (
                        <button
                            className={`flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-foreground/5 ${lang === locale ? 'font-medium' : ''}`}
                            onClick={() => handleSwitch(lang)}
                            key={lang}>
                            <span>{localeFlags[lang]}</span>
                            <span>{localeLabels[lang]}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default LanguageSwitcher;
