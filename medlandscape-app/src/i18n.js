import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-xhr-backend';

/**
 * i18n configuration (will be called from index.js)
 */
i18n
// load translation using xhr from /public/locales
    .use(Backend)
// pass the i18n instance to react-i18next.
    .use(initReactI18next)
// init i18next
    .init({
        lng: 'de',
        fallbackLng: 'de',
        debug: false,
        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        }
});

export default i18n;
