import { NextResponse } from 'next/server';

function getCloudinaryCredentials() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Cloudinary credentials are not fully configured.');
  }
  
  return { cloudName, apiKey, apiSecret };
}

function getBasicAuthToken(apiKey: string, apiSecret: string) {
  // Edge-compatible base64 encoding
  return btoa(`${apiKey}:${apiSecret}`);
}

export async function GET(request: Request) {
  try {
    const { cloudName, apiKey, apiSecret } = getCloudinaryCredentials();
    const url = new URL(request.url);
    const maxResults = url.searchParams.get('max_results') || '50';
    const nextCursor = url.searchParams.get('next_cursor') || '';

    let apiUrl = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image?max_results=${maxResults}`;
    if (nextCursor) {
      apiUrl += `&next_cursor=${encodeURIComponent(nextCursor)}`;
    }

    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Basic ${getBasicAuthToken(apiKey, apiSecret)}`
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: 'Failed to fetch assets from Cloudinary', details: errorText }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Cloudinary GET error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { cloudName, apiKey, apiSecret } = getCloudinaryCredentials();
    const body: any = await request.json();
    const publicId = body.public_id;

    if (!publicId) {
      return NextResponse.json({ error: 'public_id is required' }, { status: 400 });
    }

    // Cloudinary Admin API for deleting a single resource
    const apiUrl = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image/upload`;
    
    // We pass the public_ids as an array
    const formData = new URLSearchParams();
    formData.append('public_ids[]', publicId);

    const response = await fetch(apiUrl, {
      method: 'DELETE',
      headers: {
        'Authorization': `Basic ${getBasicAuthToken(apiKey, apiSecret)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString()
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: 'Failed to delete asset', details: errorText }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Cloudinary DELETE error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
