import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import AsyncStorage from '@react-native-community/async-storage';
import {NativeModules} from 'react-native';
import {Platform} from 'react-native';

import {de, en} from './translations';

function localeToLanguage(locale) {
    return locale.replace('_', '-');
}

i18n.use(initReactI18next)
    .use({
        type: 'languageDetector',
        async: true,
        init: () => {},
        detect: function(callback) {
            /**
             * Language detection in react native is a minefield so here's the best approach:
             * - https://github.com/facebook/react-native/issues/26540
             * - https://stackoverflow.com/a/35493069
             */
            let detectedLanguage = 'en';
            if (Platform.OS === 'ios') {
                const appleLocale = NativeModules.SettingsManager.settings.AppleLocale;
                if (!appleLocale) {
                    const firstLanguage = NativeModules.SettingsManager.settings.AppleLanguages[0];
                    if (firstLanguage) {
                        detectedLanguage = firstLanguage;
                    }
                } else {
                    detectedLanguage = localeToLanguage(appleLocale);
                }
            } else if (Platform.OS === 'android') {
                const androidLocale = NativeModules.I18nManager.localeIdentifier;
                if (androidLocale) {
                    detectedLanguage = localeToLanguage(androidLocale);
                }
            }

            callback(detectedLanguage);
        },
        cacheUserLanguage: () => {},
    })
    .init({
        resources: {
            de,
            en,
        },
        fallbackLng: 'en',
        returnNull: false,
        returnEmptyString: false,
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
