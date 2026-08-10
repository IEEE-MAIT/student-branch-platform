'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/Badge';

export default function AssetsPage() {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/assets');
      const json: any = await res.json();
      if (json.success) {
        setAssets(json.data.resources || []);
      } else {
        setError(json.error || 'Failed to fetch assets');
      }
    } catch (err) {
      setError('An error occurred while fetching assets.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setUploading(true);
    setError('');
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await fetch('/api/admin/assets/upload', {
        method: 'POST',
        body: formData,
      });
      const json: any = await res.json();
      if (json.success) {
        // Prepend new asset to list
        setAssets([json.data, ...assets]);
      } else {
        setError(json.error || 'Failed to upload asset');
      }
    } catch (err) {
      setError('An error occurred while uploading.');
    }
    
    setUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (publicId: string) => {
    if (!confirm('Are you sure you want to delete this asset? This cannot be undone.')) return;
    
    try {
      const res = await fetch('/api/admin/assets', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ public_id: publicId }),
      });
      
      const json: any = await res.json();
      if (json.success) {
        setAssets(assets.filter(a => a.public_id !== publicId));
      } else {
        setError(json.error || 'Failed to delete asset');
      }
    } catch (err) {
      setError('An error occurred while deleting.');
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    alert('Copied URL to clipboard!');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-serif text-ink mb-1">Media Library</h2>
          <p className="text-sm text-warm-400 font-sans">
            Manage your Cloudinary assets directly from the CMS.
          </p>
        </div>
        <div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleUpload} 
            className="hidden" 
            accept="image/*" 
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-4 py-2 bg-ieee-blue text-white text-xs font-mono font-bold uppercase tracking-wider rounded-[2px] hover:bg-ieee-blue/90 disabled:opacity-50 transition-colors"
          >
            {uploading ? 'Uploading...' : 'Upload Asset'}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 text-xs font-mono mb-6 border border-red-200">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-warm-400 font-mono text-sm">Loading assets...</div>
      ) : assets.length === 0 ? (
        <div className="py-12 text-center text-warm-400 font-mono text-sm bg-warm-50 border border-warm-200 rounded-[2px]">
          No assets found. Upload one to get started!
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {assets.map((asset) => (
            <div key={asset.public_id} className="border border-warm-200 rounded-[2px] overflow-hidden group bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="relative aspect-square bg-warm-100">
                <Image
                  src={asset.secure_url}
                  alt={asset.public_id}
                  fill
                  className="object-cover"
                  unoptimized // We use unoptimized for the admin thumbnail view to save image optimization bandwidth
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center gap-2">
                  <button 
                    onClick={() => copyToClipboard(asset.secure_url)}
                    className="px-3 py-1.5 bg-white text-ink text-xs font-medium rounded hover:bg-warm-100"
                  >
                    Copy URL
                  </button>
                  <button 
                    onClick={() => handleDelete(asset.public_id)}
                    className="px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="p-2 border-t border-warm-200">
                <p className="text-[10px] font-mono text-warm-500 truncate" title={asset.public_id}>
                  {asset.public_id}
                </p>
                <div className="flex justify-between items-center mt-1">
                  <Badge variant="neutral">{asset.format.toUpperCase()}</Badge>
                  <span className="text-[10px] text-warm-400">
                    {(asset.bytes / 1024).toFixed(1)} KB
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
