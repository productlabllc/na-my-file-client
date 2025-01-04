import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// init translations files
import enTranslations from './locales/en.json';

// User translations
import enUser from './locales/en-us_user.json';

// Docs translations
import enDocs from './locales/en-us_docs.json';

// Applications translations
import enApplications from './locales/en-us_applications.json';
import activityLogs from './locales/en-us_activitylogs.json';

// Agent translations
import agent from './locales/en-us_agent.json';

// Terms of use translations
import termsOfUse from './locales/en-us_terms-of-use.json';

// Support page transtations
import support from './locales/en-us_support.json';

const enUsResources = {
  translations: enTranslations,
  user: enUser,
  docs: enDocs,
  applications: enApplications,
  activityLogs: activityLogs,
  agent: agent,
  termsOfUse: termsOfUse,
  support: support
} as const;

export const resources = {
  'en-us': enUsResources,
  en: enUsResources,
  es: enUsResources,
  fr: enUsResources,
  ch: enUsResources,
  ar: enUsResources,
  ru: enUsResources,
  urd: enUsResources,
  ko: enUsResources,
  ht: enUsResources,
  bn: enUsResources,
  pl: enUsResources,
  uk: enUsResources,
  pt: enUsResources
} as const;

i18n.use(initReactI18next).init({
  fallbackLng: 'en-us',
  lng: 'en-us',
  resources,
  // namespace
  ns: ['translations', 'docs', 'user', 'applications', 'activityLogs', 'agent', 'termsOfUse', 'support'],
  // defaultNamespace
  defaultNS: 'translations'
});

i18n.languages = ['en-us', 'es', 'fr', 'ch', 'ar', 'ru', 'urd', 'ko', 'ht', 'bn', 'pl', 'uk', 'pt'];

export default i18n;
