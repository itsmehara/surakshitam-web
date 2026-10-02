import type { Metadata } from "next";
import Link from "next/link";

// Foot Cream was merged into Foot Crack Heel Cream (2 Oct 2026). The old URL was live on v3,
// so keep it working: a plain meta refresh, since the static export has no server redirects.
const target = "/product/foot-crack-heel-cream/";

export const metadata: Metadata = {
  title: "Foot Crack Heel Cream",
  alternates: { canonical: target },
  robots: { index: false },
};

export default function FootCreamRedirect() {
  return (
    <main className="container py-20 text-center">
      <meta httpEquiv="refresh" content={`0;url=${target}`} />
      <p>
        Foot Cream is now <Link href={target} className="underline">Foot Crack Heel Cream</Link>.
      </p>
    </main>
  );
}
