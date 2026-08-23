import nextPlugin from "@next/eslint-plugin-next";

const eslintConfig = [
	{
		ignores: [".next/**", ".open-next/**", ".wrangler/**", "node_modules/**", "dist/**", "cloudflare-env.d.ts"],
	},
	nextPlugin.configs["core-web-vitals"],
];

export default eslintConfig;
