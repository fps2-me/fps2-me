// src/app/components/Footer.tsx
'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

export function Footer() {
  const t = useTranslations('Footer'); 

  return (
    <footer className="w-full shrink-0 py-8 text-center text-lg">
      <p>
        <Link href="/" className="hover:underline">
          {t('home')}
        </Link>
        <span className="mx-2">|</span>
        <Link href="/qr" className="hover:underline">
          {t('qr_generator')}
        </Link>
      </p>
      <span className="mx-2">{t('disclaimer')}</span>
      <p>
        <Link href="/terms" className="hover:underline">
          {t('terms_condition')}
        </Link>
        <span className="mx-2">{t('and')}</span>
        <Link href="/privacy" className="hover:underline">
          {t('privacy_notice')}
        </Link>
      </p>
    </footer>
  );
}
