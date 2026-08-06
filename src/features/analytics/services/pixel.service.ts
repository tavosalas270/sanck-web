import type { FbqEventName, TtqEventName, PurchaseEventParams, ViewContentEventParams } from '../interfaces';

// ─── Helpers de seguridad ────────────────────────────────────────────────────
// Verifican que el objeto global exista antes de llamarlo.
// Esto evita errores en SSR (Next.js renderiza en servidor donde window no existe).

const isBrowser = typeof window !== 'undefined';

// ─── META PIXEL — Eventos estándar ───────────────────────────────────────────

/**
 * Dispara un evento estándar de Meta Pixel.
 */
export const trackMetaEvent = (
  eventName: FbqEventName,
  params?: Record<string, unknown>
): void => {
  if (!isBrowser) return;
  const fbq = (window as any).fbq;
  if (typeof fbq !== 'function') {
    console.warn('[Analytics] Meta Pixel (fbq) no está disponible.');
    return;
  }
  if (params) {
    fbq('track', eventName, params);
  } else {
    fbq('track', eventName);
  }
};

// ─── TIKTOK PIXEL — Eventos estándar ─────────────────────────────────────────

/**
 * Dispara un evento estándar de TikTok Pixel.
 */
export const trackTikTokEvent = (
  eventName: TtqEventName,
  params?: Record<string, unknown>
): void => {
  if (!isBrowser) return;
  const ttq = (window as any).ttq;
  if (!ttq || typeof ttq.track !== 'function') {
    console.warn('[Analytics] TikTok Pixel (ttq) no está disponible.');
    return;
  }
  if (params) {
    ttq.track(eventName, params);
  } else {
    ttq.track(eventName);
  }
};

// ─── EVENTOS PERSONALIZADOS (Custom Events) ───────────────────────────────────
// Cuando los eventos estándar no son suficientes, se usan eventos custom.
// Meta: fbq('trackCustom', eventName, params)
// TikTok: ttq.track(eventName, params) — acepta nombres custom nativamente

/**
 * Dispara un evento personalizado en Meta Pixel.
 */
export const trackCustomMetaEvent = (
  eventName: string,
  params?: Record<string, unknown>
): void => {
  if (!isBrowser) return;
  const fbq = (window as any).fbq;
  if (typeof fbq !== 'function') return;
  if (params) {
    fbq('trackCustom', eventName, params);
  } else {
    fbq('trackCustom', eventName);
  }
};

/**
 * Dispara un evento personalizado en TikTok Pixel.
 */
export const trackCustomTikTokEvent = (
  eventName: string,
  params?: Record<string, unknown>
): void => {
  if (!isBrowser) return;
  const ttq = (window as any).ttq;
  if (!ttq || typeof ttq.track !== 'function') return;
  if (params) {
    ttq.track(eventName, params);
  } else {
    ttq.track(eventName);
  }
};

// ─── EVENTOS COMBINADOS (disparan en ambas plataformas) ──────────────────────

/**
 * Dispara CompleteRegistration en Meta y TikTok.
 * Llamar al finalizar el flujo de registro exitosamente.
 */
export const trackRegistration = (): void => {
  trackMetaEvent('CompleteRegistration');
  trackTikTokEvent('CompleteRegistration');
};

/**
 * Dispara Lead (Meta) y ClickButton (TikTok) al iniciar sesión.
 */
export const trackLogin = (): void => {
  trackMetaEvent('Lead');
  trackTikTokEvent('ClickButton');
};

/**
 * Dispara Purchase en Meta y TikTok al comprar un episodio con tokens.
 * @param value - Costo en tokens
 * @param currency - Moneda (ej: 'TOKENS')
 * @param contentName - Nombre del episodio
 */
export const trackPurchase = (
  value: number,
  currency: string = 'USD',
  contentName?: string
): void => {
  const params: PurchaseEventParams = { value, currency, content_name: contentName };
  trackMetaEvent('Purchase', params as unknown as Record<string, unknown>);
  trackTikTokEvent('Purchase', params as unknown as Record<string, unknown>);
};

/**
 * Dispara ViewContent en Meta y TikTok al reproducir un video.
 * @param contentName - Título del video
 * @param contentIds - IDs del contenido
 */
export const trackVideoView = (
  contentName?: string,
  contentIds?: string[]
): void => {
  const params: ViewContentEventParams = {
    content_name: contentName,
    content_id: contentIds?.[0],  // TikTok requiere content_id como string
    content_ids: contentIds,       // Meta requiere content_ids como array
    content_type: 'product',       // TikTok solo acepta 'product' o 'product_group'
  };
  trackMetaEvent('ViewContent', params as Record<string, unknown>);
  trackTikTokEvent('ViewContent', params as Record<string, unknown>);
};


/**
 * Dispara el evento estándar 'Search' en Meta y TikTok cuando el usuario realiza una búsqueda.
 * @param searchQuery - Término que el usuario buscó
 */
export const trackSearch = (searchQuery: string): void => {
  if (!searchQuery.trim()) return;
  const params = { search_string: searchQuery.trim() };
  trackMetaEvent('Search', params as Record<string, unknown>);
  trackTikTokEvent('Search', params as Record<string, unknown>);
};

/**
 * Dispara el evento custom 'LikeVideo' en Meta y TikTok cuando el usuario da like a un video.
 * @param contentName - Título del video
 * @param contentId - ID del video
 */
export const trackLike = (contentName?: string, contentId?: string): void => {
  const params = {
    content_name: contentName,
    content_id: contentId,                        // TikTok: string individual
    content_ids: contentId ? [contentId] : [],    // Meta: array
    content_type: 'product',
  };
  trackCustomMetaEvent('LikeVideo', params);
  trackCustomTikTokEvent('LikeVideo', params);
};


/**
 * Dispara el evento custom 'AddFavorite' en Meta y TikTok cuando el usuario agrega un video a favoritos.
 * @param contentName - Título del video
 * @param contentId - ID del video
 */
export const trackFavorite = (contentName?: string, contentId?: string): void => {
  const params = {
    content_name: contentName,
    content_id: contentId,                        // TikTok: string individual
    content_ids: contentId ? [contentId] : [],    // Meta: array
    content_type: 'product',
  };
  trackCustomMetaEvent('AddFavorite', params);
  trackCustomTikTokEvent('AddFavorite', params);
};


/**
 * Dispara el evento custom 'PostComment' en Meta y TikTok cuando el usuario publica un comentario.
 * @param contentName - Título del video comentado
 * @param contentId - ID del video
 */
export const trackComment = (contentName?: string, contentId?: string): void => {
  const params = {
    content_name: contentName,
    content_id: contentId,                        // TikTok: string individual
    content_ids: contentId ? [contentId] : [],    // Meta: array
    content_type: 'product',
  };
  trackCustomMetaEvent('PostComment', params);
  trackCustomTikTokEvent('PostComment', params);
};

