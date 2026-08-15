import { site } from "@/lib/site";
import { WhatsAppIcon } from "@/components/icons";

/** Floating WhatsApp contact button, shown on every page (bottom-right). */
export function WhatsAppFloat() {
  const number = site.whatsapp.replace(/\D/g, "");
  const message = encodeURIComponent(
    "Hi Surakshitam Naturals! I'd like to know more about your products.",
  );
  return (
    <a
      href={`https://wa.me/${number}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="group fixed bottom-5 right-5 z-40 flex items-center gap-0 rounded-full bg-[#25D366] text-white shadow-card transition-all duration-300 ease-smooth hover:gap-2 hover:pr-4 sm:bottom-6 sm:right-6"
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-full">
        <WhatsAppIcon width={26} height={26} />
      </span>
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-medium opacity-0 transition-all duration-300 ease-smooth group-hover:max-w-[8rem] group-hover:opacity-100">
        Chat with us
      </span>
    </a>
  );
}
