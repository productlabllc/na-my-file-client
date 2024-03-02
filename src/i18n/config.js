import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { enTranslations } from './locales/en';
import { esTranslations } from './locales/es';

i18n.use(initReactI18next).init({
  fallbackLng: 'en',
  lng: 'en',
  resources: {
    en: {
      translations: enTranslations
    },
    es: {
      translations: esTranslations
    }
  },
  // namespace
  ns: ['translations'],
  // defaultNamespace
  defaultNS: 'translations'
});

i18n.languages = ['en', 'es'];

export default i18n;
