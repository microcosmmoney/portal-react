import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'zh', 'ko', 'ja'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  localeDetection: true
});
