import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

import {de, en} from './translations';

// console.error('HI', en);

i18n.use(initReactI18next).init({
  resources: {
    de,
    en,
  },
  lng: 'en',

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
