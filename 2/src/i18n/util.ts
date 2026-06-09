import manifest from "../../i18n.config.json";
export const fallbackLng = manifest.fallbackLng;
export const supportedLngs = manifest.languages.map((l) => l.code);
export const languageOptions = manifest.languages.map((l) => ({ code: l.code, label: l.label }));
export function normalizeLanguage(lang: string): string {
  for (const l of manifest.languages) { if (l.detect.includes(lang)) return l.code; }
  return fallbackLng;
}
export function getLanguageDirection(code: string): "ltr" | "rtl" {
  const lang = manifest.languages.find((l) => l.code === code);
  return (lang?.dir ?? "ltr") as "ltr" | "rtl";
}
