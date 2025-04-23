import React from 'react';
import Image, { ImageProps } from 'next/image';

interface ImageWithFallbackProps extends Omit<ImageProps, 'src'> {
  src: string;
  fallbackSrc?: string;
}

/**
 * Image component with fallback for when the image fails to load
 */
export const ImageWithFallback = ({
  src,
  fallbackSrc = '/images/placeholder-shop.png',
  alt,
  ...props
}: ImageWithFallbackProps) => {
  const [imgSrc, setImgSrc] = React.useState(src);
  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setImgSrc(src);
    setError(false);
    setLoading(true);
  }, [src]);

  return (
    <>
      {loading && (
        <div style={{
          width: props.width || '100%',
          height: props.height || '100%',
          background: '#f3f3f3',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <img src={fallbackSrc} alt="placeholder" style={{ width: 40, height: 40, opacity: 0.3 }} />
        </div>
      )}
      <Image
        {...props}
        src={error ? fallbackSrc : imgSrc}
        alt={alt || 'Image'}
        style={{
          ...(props.style || {}),
          display: loading ? 'none' : 'block',
        }}
        onLoad={() => setLoading(false)}
        onError={() => {
          setError(true);
          setImgSrc(fallbackSrc);
          setLoading(false);
        }}
      />
    </>
  );
};
