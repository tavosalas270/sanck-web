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
    
    // Si la base no termina en /media y el path no empieza con /media, lo insertamos (Requerido por Django)
    if (!cleanBase.endsWith('/media') && !cleanPath.startsWith('/media/')) {
        cleanPath = `/media${cleanPath}`;
    }
    
    return encodeURI(`${cleanBase}${cleanPath}`);
};
