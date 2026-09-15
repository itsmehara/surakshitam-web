"use client";

import { useEnquiryList } from "@/lib/enquiry-list/EnquiryListContext";
import { ClipboardIcon } from "@/components/icons";

/**
 * Floating "enquiry list" button, first item in the bottom-right
 * `FloatingContact` stack. Rendered only once something is in the list —
 * before that the "Add to enquiry" buttons carry the concept on their own.
 */
export function EnquiryListFab() {
  const { count, ready, openDrawer } = useEnquiryList();
  if (!ready || count === 0) return null;

  return (
    <button
      type="button"
      onClick={openDrawer}
      aria-label={`Open enquiry list, ${count} product${count === 1 ? "" : "s"}`}
      className="group relative flex items-center overflow-hidden rounded-full bg-forest text-cream shadow-card transition-transform duration-200 hover:scale-[1.03]"
    >
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-medium opacity-0 transition-all duration-300 ease-smooth group-hover:max-w-[8rem] group-hover:pl-4 group-hover:opacity-100">
        Enquiry list
      </span>
      <span className="flex h-14 w-14 shrink-0 items-center justify-center">
        <ClipboardIcon width={24} height={24} />
      </span>
      <span className="absolute right-1 top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-clay px-1.5 text-[0.7rem] font-semibold text-cream">
        {count}
      </span>
    </button>
  );
}
