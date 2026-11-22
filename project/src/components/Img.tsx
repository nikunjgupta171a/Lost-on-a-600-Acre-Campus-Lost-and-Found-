import { useState } from 'react';

const FALLBACK_GRADIENTS = [
  'linear-gradient(135deg, #101D3A 0%, #17294D 100%)',
  'linear-gradient(135deg, #17294D 0%, #F47B20 140%)',
  'linear-gradient(135deg, #364D8F 0%, #101D3A 100%)',
  'linear-gradient(135deg, #F47B20 0%, #D96414 100%)',
  'linear-gradient(135deg, #0C172E 0%, #6779AC 100%)',
];

interface ImgProps {
  src: string;
  alt: string;
  className?: string;
  fallbackIndex?: number;
  fallbackLabel?: string;
}

/**
 * Image with graceful fallback to a navy/orange gradient block so the UI
 * never shows a broken image icon even if the remote URL fails.
 */
export function Img({ src, alt, className = '', fallbackIndex = 0, fallbackLabel }: ImgProps) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    const grad = FALLBACK_GRADIENTS[fallbackIndex % FALLBACK_GRADIENTS.length];
    return (
      <div
        className={`flex items-center justify-center overflow-hidden ${className}`}
        style={{ background: grad }}
        role="img"
        aria-label={alt}
      >
        <span className="px-3 text-center text-xs font-semibold uppercase tracking-wider text-white/70">
          {fallbackLabel || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
