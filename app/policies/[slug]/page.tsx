import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/ui/PageIntro";

const policies: Record<string, { title: string; intro: string }> = {
  privacy: {
    title: "Privacy Policy",
    intro: "How we handle your information. Placeholder policy for the prototype — to be finalised with legal review.",
  },
  terms: {
    title: "Terms & Conditions",
    intro: "The terms for using this site and buying our products. Placeholder for the prototype.",
  },
  shipping: {
    title: "Shipping Policy",
    intro: "Delivery timelines, charges and coverage. Placeholder estimates shown for the prototype.",
  },
  returns: {
    title: "Returns & Cancellations",
    intro: "How returns and cancellations work. Placeholder policy for the prototype.",
  },
};

export function generateStaticParams() {
  return Object.keys(policies).map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const policy = policies[params.slug];
  return { title: policy?.title ?? "Policy" };
}

export default function PolicyPage({ params }: { params: { slug: string } }) {
  const policy = policies[params.slug];
  if (!policy) notFound();

  return (
    <>
      <PageIntro eyebrow="Policies" title={policy.title} intro={policy.intro} />
      <div className="container py-12 sm:py-16">
        <div className="max-w-prose space-y-4 text-forest/75">
          <p>
            This is placeholder content for the clickable prototype. The finalised policy will be
            added before launch, with the founders and, where needed, legal review.
          </p>
          <p>
            For any questions in the meantime, please{" "}
            <a href="/contact" className="font-medium text-moss underline">
              contact us
            </a>
            .
          </p>
        </div>
      </div>
    </>
  );
}
