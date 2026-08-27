import { NextResponse } from 'next/server';
import { guardApiRoute } from '@/lib/auth';
import { recordAuditLog } from '@/lib/auditLog';

function getCloudinaryCredentials() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Cloudinary credentials are not fully configured.');
  }
  
  return { cloudName, apiKey, apiSecret };
}

async function generateSignature(params: Record<string, string>, apiSecret: string) {
  const sortedKeys = Object.keys(params).sort();
  const signatureString = sortedKeys.map(key => `${key}=${params[key]}`).join('&') + apiSecret;
  
  const encoder = new TextEncoder();
  const data = encoder.encode(signatureString);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
}

export async function POST(request: Request) {
  try {
    const authCheck = await guardApiRoute(request, 'Galleries', 'create');
    if (!authCheck.isAuthorized) {
      return authCheck.errorResponse;
    }
    const user = authCheck.user;

    const { cloudName, apiKey, apiSecret } = getCloudinaryCredentials();
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const timestamp = Math.round(new Date().getTime() / 1000).toString();
    const paramsToSign = {
      timestamp
    };

    const signature = await generateSignature(paramsToSign, apiSecret);

    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append('file', file);
    cloudinaryFormData.append('api_key', apiKey);
    cloudinaryFormData.append('timestamp', timestamp);
    cloudinaryFormData.append('signature', signature);

    const apiUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      body: cloudinaryFormData
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: 'Failed to upload to Cloudinary', details: errorText }, { status: response.status });
    }

    const data: any = await response.json();

    await recordAuditLog({
      performedBy: user.name || user.email,
      userEmail: user.email,
      actionType: 'CREATE',
      entityType: 'ASSET',
      entityId: data.public_id || data.secure_url,
      entityTitle: data.original_filename || 'Uploaded File',
      changeSummary: `Uploaded media asset to Cloudinary: ${data.secure_url || data.public_id}`,
    });

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Cloudinary POST upload error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
