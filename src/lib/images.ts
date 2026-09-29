const UNSPLASH = 'https://images.unsplash.com/photo-';

interface ImageOptions {
  width: number;
  height?: number;
  quality?: number;
  crop?: 'faces' | 'entropy' | 'center';
}

/** Builds an optimised Unsplash CDN url for a photo id. */
export function unsplash(id: string, { width, height, quality = 75, crop }: ImageOptions): string {
  const params = new URLSearchParams({ w: String(width), q: String(quality), auto: 'format', fit: 'crop' });
  if (height) params.set('h', String(height));
  if (crop) params.set('crop', crop);
  return `${UNSPLASH}${id}?${params.toString()}`;
}

/** Responsive srcset for a photo id, keeping the given aspect ratio. */
export function unsplashSrcSet(id: string, widths: number[], ratio?: number, crop?: ImageOptions['crop']): string {
  return widths
    .map((w) => `${unsplash(id, { width: w, height: ratio ? Math.round(w / ratio) : undefined, crop })} ${w}w`)
    .join(', ');
}
