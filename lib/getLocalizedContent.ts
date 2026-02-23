type ContentRecord = Record<string, unknown>;

const FALLBACK_LOCALES = ["en", "de", "fr", "es"];

const normalizeLocale = (locale?: string) => {
	if (!locale) return "en";
	return locale.toLowerCase().split("-")[0];
};

const asString = (value: unknown) => {
	if (typeof value === "string") return value;
	if (value == null) return "";
	return String(value);
};

export const getLocalizedContent = (
	data: ContentRecord | null | undefined,
	field: string,
	locale?: string
) => {
	if (!data || !field) return "";

	const normalizedLocale = normalizeLocale(locale);
	const localizedKey = `${field}_${normalizedLocale}`;
	const localizedValue = data[localizedKey];

	if (localizedValue) return asString(localizedValue);

	for (const fallbackLocale of FALLBACK_LOCALES) {
		const fallbackValue = data[`${field}_${fallbackLocale}`];
		if (fallbackValue) return asString(fallbackValue);
	}

	return asString(data[field]);
};
