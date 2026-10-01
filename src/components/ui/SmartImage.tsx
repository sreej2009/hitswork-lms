import { useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/cn';
import { unsplash, unsplashSrcSet } from '../../lib/images';

interface SmartImageProps {
  /** Unsplash photo id */
  photoId: string;
  alt: string;
  /** Default render width in CSS pixels */
  width: number;
  /** Width / height, used to request a correctly cropped image */
  ratio?: number;
  /** Candidate widths for srcset */
  widths?: number[];
  sizes?: string;
  crop?: 'faces' | 'entropy' | 'center';
  priority?: boolean;
  className?: string;
}

/** Lazy, responsive image that fades in over a soft brand-tinted placeholder. */
export function SmartImage({
  photoId,
  alt,
  width,
  ratio,
  widths,
  sizes,
  crop,
  priority = false,
  className,
}: SmartImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  // Images served from cache can finish before React attaches onLoad.
  useEffect(() => {
    if (ref.current?.complete && ref.current.naturalWidth > 0) setLoaded(true);
  }, []);

  // Uploaded images (data/blob URLs) are used as-is; everything else is an Unsplash photo id.
  const direct = /^(data:|blob:|https?:)/.test(photoId);

  if (failed) {
    return <div role="img" aria-label={alt} className={cn('bg-linear-to-br from-brand-50 to-grape-100', className)} />;
  }

  return (
    <img
      ref={ref}
      src={direct ? photoId : unsplash(photoId, { width, height: ratio ? Math.round(width / ratio) : undefined, crop })}
      srcSet={!direct && widths ? unsplashSrcSet(photoId, widths, ratio, crop) : undefined}
      sizes={sizes}
      alt={alt}
      width={width}
      height={ratio ? Math.round(width / ratio) : undefined}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
      onLoad={() => setLoaded(true)}
      onError={() => setFailed(true)}
      className={cn(
        'bg-linear-to-br from-brand-50 to-grape-50 object-cover transition-opacity duration-500',
        loaded ? 'opacity-100' : 'opacity-0',
        className,
      )}
    />
  );
}
