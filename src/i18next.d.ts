// import the original type declarations
import 'i18next';
// import all namespaces (for the default language, only)

import { resources } from './i18n/config';

declare module 'i18next' {
  // Extend CustomTypeOptions
  interface CustomTypeOptions {
    // custom namespace type, if you changed it
    defaultNS: 'translations';
    fallbackLng: 'en-us';
    lng: 'en-us';
    ns: ['translations', 'docs', 'applications', 'activityLogs', 'user'];
    // custom resources type
    resources: (typeof resources)['en-us'];
  }
}
