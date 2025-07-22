import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

import * as de from './de';
import * as en from './en';

const resources = {
  de,
  en,
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: ['de', 'en'],
    fallbackLng: 'de',
    debug: true,
    resources,
    load: 'languageOnly',
    detection: {
      // transforms the browser language from `de-DE` to `de` which matches `languageOnly`
      convertDetectedLanguage: (lng) => lng.substring(0, 2),
    },
  });

export default i18n;
