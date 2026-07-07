import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Static export: `next build` writes plain HTML/CSS/JS to ./out,
  // deployable to GitHub Pages, Netlify, or Cloudflare Pages with no server.
  output: 'export',
};

export default nextConfig;
