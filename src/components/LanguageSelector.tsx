'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: 'EN', label: 'EN' },
    { code: 'DE', label: 'DE' },
    { code: 'FR', label: 'FR' },
    { code: 'ES', label: 'ES' },
    { code: 'IT', label: 'IT' },
  ] as const;

  return (
    <div className="flex gap-2">
      {languages.map((lang) => (
        <Button
          key={lang.code}
          variant={language === lang.code ? "default" : "ghost"}
          size="sm"
          onClick={() => setLanguage(lang.code)}
          className="w-10"
        >
          {lang.label}
        </Button>
      ))}
    </div>
  );
} 