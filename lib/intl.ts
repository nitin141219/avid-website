export function resolveLocaleTag(preferredLocale?: string): string {
  if (preferredLocale && preferredLocale.includes("-")) return preferredLocale;

  return preferredLocale || "en";
}

export function formatDate(
  input: string | Date,
  preferredLocale?: string,
  options: Intl.DateTimeFormatOptions = { dateStyle: "medium" }
): string {
  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) return String(input);
  const locale = resolveLocaleTag(preferredLocale);
  return new Intl.DateTimeFormat(locale, options).format(date);
}

export function formatDateTime(
  input: string | Date,
  preferredLocale?: string,
  options: Intl.DateTimeFormatOptions = { dateStyle: "medium", timeStyle: "short" }
): string {
  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) return String(input);
  const locale = resolveLocaleTag(preferredLocale);
  return new Intl.DateTimeFormat(locale, options).format(date);
}

export function formatTime(
  input: string | Date,
  preferredLocale?: string,
  options: Intl.DateTimeFormatOptions = { hour: "2-digit", minute: "2-digit" }
): string {
  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) return String(input);
  const locale = resolveLocaleTag(preferredLocale);
  return new Intl.DateTimeFormat(locale, options).format(date);
}
