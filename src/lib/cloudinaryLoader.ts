export default function cloudinaryLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  if (!src) return '';

  // Cloudinary optimization transformations
  if (src.includes('res.cloudinary.com')) {
    const params = [
      'f_auto',
      'c_limit',
      `w_${width}`,
      `q_${quality || 'auto'}`,
    ].join(',');

    // Insert transformations after /image/upload/
    if (src.includes('/image/upload/')) {
      return src.replace('/image/upload/', `/image/upload/${params}/`);
    }
    return `${src}?w=${width}&q=${quality || 'auto'}`;
  }

  // For non-Cloudinary or static assets, include width to satisfy Next.js loader interface
  const separator = src.includes('?') ? '&' : '?';
  return `${src}${separator}w=${width}`;
}
