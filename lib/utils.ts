import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const LOCAL_HOSTNAMES = new Set(["localhost", "127.0.0.1", "0.0.0.0"])

function getPathWithoutQuery(value: string): string {
  return value.split("?")[0] || value
}

function getExtension(value: string): string {
  const pathOnly = getPathWithoutQuery(value).toLowerCase()
  const dotIndex = pathOnly.lastIndexOf(".")
  if (dotIndex === -1) return ""
  return pathOnly.slice(dotIndex)
}

function getBaseKey(value: string): string {
  const pathOnly = getPathWithoutQuery(value).toLowerCase()
  return pathOnly.replace(/\.(png|jpe?g|webp|avif)$/i, "")
}

function preferWebpFromCandidates(target: string, candidates: string[]): string {
  const ext = getExtension(target)
  if (ext === ".webp") return target

  const baseKey = getBaseKey(target)
  const webpVariant = candidates.find((candidate) => {
    return getExtension(candidate) === ".webp" && getBaseKey(candidate) === baseKey
  })

  return webpVariant || target
}

function getPreferredMediaOrigin(): URL | null {
  const candidates = [process.env.BACKEND_URL, process.env.NEXT_PUBLIC_BASE_URL].filter(
    (value): value is string => Boolean(value)
  )

  for (const candidate of candidates) {
    try {
      const parsed = new URL(candidate)
      if (!LOCAL_HOSTNAMES.has(parsed.hostname)) return parsed
    } catch {
      // Ignore invalid URLs.
    }
  }

  if ((process.env.NEXT_PUBLIC_BASE_URL || "").includes("avidorganics.net")) {
    return new URL("https://api.avidorganics.net")
  }

  return null
}

export function resolveMediaUrl(url?: string | null, fallback = "/logo.png"): string {
  if (!url) return fallback
  return url
}

export function normalizeMediaUrl(url?: string | null, fallback = "/logo.png"): string {
  if (!url) return fallback
  if (!/^https?:\/\//i.test(url)) return url

  try {
    const parsed = new URL(url)
    if (!LOCAL_HOSTNAMES.has(parsed.hostname)) return url

    const preferredOrigin = getPreferredMediaOrigin()
    if (!preferredOrigin) return url

    parsed.protocol = preferredOrigin.protocol
    parsed.host = preferredOrigin.host
    return parsed.toString()
  } catch {
    return url
  }
}

export function normalizeResponsiveImageSources<
  T extends {
    image?: string | null
    imageMobile?: string | null
    mobileImage?: string | null
    image_mobile?: string | null
  },
>(source: T): T {
  return {
    ...source,
    image: source.image ? normalizeMediaUrl(source.image) : source.image,
    imageMobile: source.imageMobile ? normalizeMediaUrl(source.imageMobile) : source.imageMobile,
    mobileImage: source.mobileImage ? normalizeMediaUrl(source.mobileImage) : source.mobileImage,
    image_mobile: source.image_mobile ? normalizeMediaUrl(source.image_mobile) : source.image_mobile,
  }
}

export function getResponsiveImageSources(
  source?: {
    image?: string | null
    imageMobile?: string | null
    mobileImage?: string | null
    image_mobile?: string | null
  } | null,
  fallback = "/logo.png"
) {
  const candidateValues = [
    source?.image,
    source?.imageMobile,
    source?.mobileImage,
    source?.image_mobile,
    fallback,
  ].filter((value): value is string => Boolean(value))

  const desktopRaw = source?.image || fallback
  const desktop = preferWebpFromCandidates(desktopRaw, candidateValues)

  const mobileRaw = source?.imageMobile || source?.mobileImage || source?.image_mobile || desktop
  const mobile = preferWebpFromCandidates(mobileRaw, candidateValues)

  return { desktop, mobile }
}
