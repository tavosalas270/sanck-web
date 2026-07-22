// Declaraciones de tipos globales para Meta Pixel (fbq) y TikTok Pixel (ttq)
// Esto permite usar fbq/ttq con TypeScript sin errores de tipo

export type FbqEventName =
  | 'PageView'
  | 'CompleteRegistration'
  | 'Lead'
  | 'Purchase'
  | 'ViewContent'
  | 'AddToCart'
  | 'AddToWishlist'
  | 'InitiateCheckout'
  | 'Search';

export type TtqEventName =
  | 'ViewContent'
  | 'CompleteRegistration'
  | 'PlaceAnOrder'
  | 'Purchase'
  | 'ClickButton'
  | 'AddToWishlist'
  | 'Search';

export interface PurchaseEventParams {
  value: number;
  currency: string;
  content_name?: string;
}

export interface ViewContentEventParams {
  content_name?: string;
  content_ids?: string[];
  content_type?: string;
}
