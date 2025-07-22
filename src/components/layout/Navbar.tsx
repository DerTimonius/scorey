import i18n from '@/locales/i18n';
import { Button } from '../ui/button';

export function Navbar() {
  const changeLanguage = (lang: 'de' | 'en') => {
    i18n.changeLanguage(lang);
  };

  return (
    <nav className="flex h-16 flex-row items-center justify-around border-border border-b-2 bg-cyan-background">
      <p className="font-extrabold text-4xl">Scorey</p>
      <div className="flex gap-4">
        <Button onClick={() => changeLanguage('de')} variant="tertiary">
          DE
        </Button>
        <Button onClick={() => changeLanguage('en')} variant="tertiary">
          EN
        </Button>
      </div>
    </nav>
  );
}
