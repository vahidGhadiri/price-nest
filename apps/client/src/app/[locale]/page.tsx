import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { use } from 'react';

interface HomePageProps {
    params: Promise<{
        locale: string;
    }>;
}

export default function HomePage({ params }: HomePageProps) {
    const { locale } = use(params);
    setRequestLocale(locale);

    const t = useTranslations('home');

    return (
        <main className="flex min-h-dvh flex-col items-center justify-center gap-8 p-8 mx-10 rounded-lg">
            <div className="flex flex-col items-center gap-4 text-center">
                <h1 className="text-4xl font-bold tracking-tight text-foreground">Price Nest</h1>
                <p className="max-w-md text-lg text-muted-foreground">{t('subtitle')}</p>
            </div>

            <Link className="rounded-lg bg-primary px-10   text-primary-foreground" href="/todos">
                View Todos
            </Link>
        </main>
    );
}
