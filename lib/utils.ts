import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

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
