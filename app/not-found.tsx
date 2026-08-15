import { LinkButton } from "@/components/ui/Button";
import { ArrowRight } from "@/components/icons";

export default function NotFound() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-serif text-6xl font-semibold text-moss">404</p>
      <h1 className="mt-4 font-serif text-3xl font-semibold text-forest">Page not found</h1>
      <p className="mt-3 max-w-md text-base leading-relaxed text-forest/70">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <div className="mt-8">
        <LinkButton href="/">
          Back to Home <ArrowRight width={16} />
        </LinkButton>
      </div>
    </div>
  );
}
