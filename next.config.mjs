/** @type {import('next').NextConfig} */

// For the R0.1 hello-world we ship a static export to GitHub Pages (a real
// public URL with zero extra infra). When we add server-side features
// (adoption applications, shelter portal, Postgres) we swap the host to
// Vercel/Fly — a host change, not a stack rewrite. See README "Deploy".
const isPages = process.env.DEPLOY_TARGET === 'github-pages';
const repo = 'gurapaws';

const nextConfig = {
  output: 'export',
  // Project Pages serve under /<repo>; basePath keeps asset URLs correct.
  basePath: isPages ? `/${repo}` : '',
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
