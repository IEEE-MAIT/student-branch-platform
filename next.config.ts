import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		loader: 'custom',
		loaderFile: './src/lib/cloudinaryLoader.ts',
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'res.cloudinary.com',
			},
		],
	},
	async redirects() {
		return [
			{
				source: '/stories',
				destination: '/publications',
				permanent: true,
			},
			{
				source: '/stories/:slug',
				destination: '/publications/:slug',
				permanent: true,
			},
		];
	},
};

export default nextConfig;

// Enable calling `getCloudflareContext()` in `next dev`.
// See https://opennext.js.org/cloudflare/bindings#local-access-to-bindings.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
