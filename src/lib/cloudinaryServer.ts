/**
 * @file src/lib/cloudinaryServer.ts
 * @description Server-side Cloudinary utilities for asset management, public_id parsing, and remote deletion.
 */

/**
 * Extracts Cloudinary public_id from a full Cloudinary URL.
 * Handles transformed URLs, versions (e.g. v1787212896), nested folders, and extensions.
 */
export function extractCloudinaryPublicId(url?: string | null): string | null {
  if (!url || typeof url !== 'string' || !url.includes('res.cloudinary.com')) {
    return null;
  }

  try {
    const uploadIdx = url.indexOf('/image/upload/');
    if (uploadIdx === -1) return null;

    // Get path after /image/upload/
    let afterUpload = url.substring(uploadIdx + '/image/upload/'.length);

    // Strip query parameters
    if (afterUpload.includes('?')) {
      afterUpload = afterUpload.split('?')[0];
    }

    const segments = afterUpload.split('/');
    const pathSegments: string[] = [];
    let isPastPrefix = false;

    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i];
      if (!isPastPrefix) {
        // Version prefix like v1787212896
        if (/^v\d+$/.test(seg)) {
          isPastPrefix = true;
          continue;
        }
        // Transformation parameters like f_auto,q_auto,w_500,c_limit
        if (seg.includes(',') || seg.includes('_')) {
          continue;
        }
        // If not transformation and not version, it's the start of public_id
        isPastPrefix = true;
      }
      pathSegments.push(seg);
    }

    const fullPath = pathSegments.join('/');
    // Strip file extension
    const lastDot = fullPath.lastIndexOf('.');
    if (lastDot !== -1) {
      return fullPath.substring(0, lastDot);
    }
    return fullPath;
  } catch (err) {
    console.error('Error extracting Cloudinary public_id:', err);
    return null;
  }
}

/**
 * Deletes an image from Cloudinary using the Admin Resource API.
 */
export async function deleteCloudinaryImage(urlOrPublicId?: string | null): Promise<boolean> {
  if (!urlOrPublicId) return false;

  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      console.warn('Cloudinary credentials not configured, skipping remote asset deletion.');
      return false;
    }

    const publicId = urlOrPublicId.startsWith('http')
      ? extractCloudinaryPublicId(urlOrPublicId)
      : urlOrPublicId;

    if (!publicId) return false;

    const apiUrl = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image/upload`;
    const formData = new URLSearchParams();
    formData.append('public_ids[]', publicId);

    const authHeader = btoa(`${apiKey}:${apiSecret}`);

    const response = await fetch(apiUrl, {
      method: 'DELETE',
      headers: {
        'Authorization': `Basic ${authHeader}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Cloudinary deletion failed for ${publicId}:`, errorText);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Error deleting Cloudinary image:', err);
    return false;
  }
}
