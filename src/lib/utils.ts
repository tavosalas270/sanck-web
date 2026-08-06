import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatUrl = (path: string | undefined | null) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  let cleanPath = path.startsWith('/') ? path : `/${path}`;

  // Videos → /media/protected_media/ | Thumbnails y resto → /media/
  if (!cleanPath.startsWith('/media/')) {
    const isVideo = cleanPath.startsWith('/videos/');
    cleanPath = isVideo
      ? `/media/protected_media${cleanPath}`
      : `/media${cleanPath}`;
  }

  return encodeURI(`${cleanBase}${cleanPath}`);
};
