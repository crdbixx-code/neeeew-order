import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";
import { fallbackLng, supportedLngs, getLanguageDirection } from "./util";

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng,
    supportedLngs,
    backend: { loadPath: "/locales/{{lng}}.json" },
    detection: { order: ["navigator", "htmlTag"] },
    interpolation: { escapeValue: false },
    // Fix 2: render immediately with fallback keys instead of waiting for
    // the HTTP locale fetch — prevents blank screen on slow/failed locale load
    react: { useSuspense: false },
  });

i18n.on("languageChanged", (lng) => {
  document.documentElement.lang = lng;
  document.documentElement.dir = getLanguageDirection(lng);
});

export default i18n;
