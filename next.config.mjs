/** @type {import('next').NextConfig} */
// v3-static: the whole site is exported to plain HTML in `out/` and served by
// GitHub Pages, so there is no image optimiser and every route must be known
// at build time (generateStaticParams on /product/[slug] and /learn/[slug]).
// trailingSlash gives `/shop/index.html`, which Pages serves at `/shop/`.
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
