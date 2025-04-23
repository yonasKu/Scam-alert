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

  React.useEffect(() => {
    // Only update the image source if it's a new image or we haven't had an error yet
    if (src !== imgSrc && !error) {
      setImgSrc(src);
      setError(false);
    }
  }, [src, imgSrc, error]);

  return (
    <Image
      {...props}
      src={error ? fallbackSrc : imgSrc}
      alt={alt || 'Image'}
      onError={() => {
        setError(true);
        setImgSrc(fallbackSrc);
      }}
    />
  );
};
