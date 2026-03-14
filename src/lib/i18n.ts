export const supportedLocales = ["zh-CN", "en"] as const;

export type SupportedLocale = (typeof supportedLocales)[number];

export const defaultLocale: SupportedLocale = "zh-CN";

function splitPath(inputPath: string) {
  const [beforeHash, hashFragment] = inputPath.split("#", 2);
  const [pathnameFragment, queryFragment] = beforeHash.split("?", 2);

  return {
    pathname: pathnameFragment || "/",
    query: queryFragment ? `?${queryFragment}` : "",
    hash: hashFragment ? `#${hashFragment}` : "",
  };
}

export function isSupportedLocale(value: string): value is SupportedLocale {
  return supportedLocales.includes(value as SupportedLocale);
}

export function getLocaleOrDefault(value: string | undefined): SupportedLocale {
  if (!value) {
    return defaultLocale;
  }
  return isSupportedLocale(value) ? value : defaultLocale;
}

export function stripLocalePrefix(pathname: string) {
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const segments = normalized.split("/").filter(Boolean);

  if (segments.length === 0) {
    return {
      locale: null as SupportedLocale | null,
      pathname: "/",
    };
  }

  const firstSegment = decodeURIComponent(segments[0]);
  if (!isSupportedLocale(firstSegment)) {
    return {
      locale: null as SupportedLocale | null,
      pathname: normalized,
    };
  }

  const restPath = segments.slice(1).join("/");
  return {
    locale: firstSegment,
    pathname: restPath ? `/${restPath}` : "/",
  };
}

export function withLocalePath(locale: SupportedLocale, path: string) {
  const { pathname, query, hash } = splitPath(path);
  const normalizedPathname = pathname.startsWith("/") ? pathname : `/${pathname}`;

  if (locale === defaultLocale) {
    return `${normalizedPathname}${query}${hash}`;
  }

  if (normalizedPathname === "/") {
    return `/${locale}${query}${hash}`;
  }

  return `/${locale}${normalizedPathname}${query}${hash}`;
}

export function switchLocalePath(pathname: string, targetLocale: SupportedLocale) {
  const stripped = stripLocalePrefix(pathname).pathname;
  return withLocalePath(targetLocale, stripped);
}

export function getOtherLocale(locale: SupportedLocale): SupportedLocale {
  return locale === "en" ? "zh-CN" : "en";
}
