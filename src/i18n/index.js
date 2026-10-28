import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.js';
import zh from './zh.js';

const saved = localStorage.getItem('locale') || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources: { en: { translation: en }, zh: { translation: zh } },
    lng: saved,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

export default i18n;
