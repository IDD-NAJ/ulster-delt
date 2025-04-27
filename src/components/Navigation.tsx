'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSelector } from './LanguageSelector';

export function Navigation() {
  const { translations } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="flex flex-col gap-4">
        <Link href="/online-banking" passHref>
          <Button
            variant="outline"
            className="w-full h-12 text-lg"
            asChild
          >
            <div>{translations.onlineBanking}</div>
          </Button>
        </Link>
        
        <Link href="/open-account" passHref>
          <Button
            className="w-full h-12 text-lg bg-emerald-400 hover:bg-emerald-500"
            asChild
          >
            <div>{translations.openAccount}</div>
          </Button>
        </Link>

        <div className="flex justify-center mt-4">
          <LanguageSelector />
        </div>
      </div>
    </div>
  );
} 