import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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
  const desktop = source?.image || fallback
  const mobile = source?.imageMobile || source?.mobileImage || source?.image_mobile || desktop

  return { desktop, mobile }
}
