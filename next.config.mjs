/** @type {import('next').NextConfig} */
// For screenshot runs (`SCREENSHOTS=1 npm run dev`), serve images unoptimized so
// every image renders instantly and reliably. Normal `npm run dev` / production
// builds are unchanged (full next/image optimisation).
const screenshotMode = process.env.SCREENSHOTS === "1";

const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: screenshotMode,
    formats: ["image/avif", "image/webp"],
    // Allow real Instagram thumbnails (Graph API) to be optimised by next/image.
    remotePatterns: [
      { protocol: "https", hostname: "**.cdninstagram.com" },
      { protocol: "https", hostname: "**.fbcdn.net" },
    ],
  },
};

export default nextConfig;
