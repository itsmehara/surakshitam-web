import { site } from "@/lib/site";
import { WhatsAppIcon, InstagramIcon } from "@/components/icons";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";

/**
 * Stacked floating contact buttons (bottom-right): Instagram, then WhatsApp.
 * Labels expand leftward on hover so they never clip the viewport edge.
 * The WhatsApp button logs its click via <WhatsAppLink> (cta "floating").
 */
export function FloatingContact() {
  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {/* Instagram */}
      <a
        href={site.social.instagram}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Follow us on Instagram"
        className="group flex items-center overflow-hidden rounded-full text-white shadow-card transition-transform duration-200 hover:scale-[1.03]"
        style={{
          background:
            "linear-gradient(45deg,#f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)",
        }}
      >
        <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-medium opacity-0 transition-all duration-300 ease-smooth group-hover:max-w-[7rem] group-hover:pl-4 group-hover:opacity-100">
          Follow us
        </span>
        <span className="flex h-14 w-14 shrink-0 items-center justify-center">
          <InstagramIcon width={26} height={26} />
        </span>
      </a>

      {/* WhatsApp */}
      <WhatsAppLink
        cta="floating"
        aria-label="Chat on WhatsApp"
        className="group flex items-center overflow-hidden rounded-full bg-[#25D366] text-white shadow-card transition-transform duration-200 hover:scale-[1.03]"
      >
        <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-medium opacity-0 transition-all duration-300 ease-smooth group-hover:max-w-[9rem] group-hover:pl-4 group-hover:opacity-100">
          Chat on WhatsApp
        </span>
        <span className="flex h-14 w-14 shrink-0 items-center justify-center">
          <WhatsAppIcon width={26} height={26} />
        </span>
      </WhatsAppLink>
    </div>
  );
}
