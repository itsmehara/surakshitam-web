"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart/CartContext";
import { buttonClass } from "./Button";

export function BuyNowButton({
  productId,
  disabled,
  className,
}: {
  productId: string;
  disabled?: boolean;
  className?: string;
}) {
  const { add, closeCart } = useCart();
  const router = useRouter();
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => {
        add(productId, 1);
        closeCart();
        router.push("/cart");
      }}
      className={buttonClass("secondary", "md", className)}
    >
      Buy Now
    </button>
  );
}
