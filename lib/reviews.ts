import type { Review } from "./types";

/** DEMO REVIEWS — clearly fictional placeholder testimonials. Replace with
 *  authentic, verified customer reviews before publishing. */
export const reviews: Review[] = [
  {
    id: "r1",
    author: "Ananya R.",
    location: "Hyderabad",
    rating: 5,
    title: "Part of our daily kitchen now",
    body: "The dishwash liquid cuts grease well and the scent is light, not overpowering. We've reordered twice.",
    product: "Natural Dishwash Liquid",
  },
  {
    id: "r2",
    author: "Karthik M.",
    location: "Bengaluru",
    rating: 5,
    title: "Soap feels genuinely nourishing",
    body: "The triple butter soap lathers beautifully and my skin doesn't feel dry after. Lovely small-batch quality.",
    product: "Triple Butter Soap",
  },
  {
    id: "r3",
    author: "Sneha P.",
    location: "Pune",
    rating: 4,
    title: "Clean floors, gentle smell",
    body: "A little goes a long way with the floor cleaner. Fresh finish without a strong chemical smell.",
    product: "Natural Floor Cleaner",
  },
  {
    id: "r4",
    author: "Rahul V.",
    location: "Chennai",
    rating: 5,
    title: "Transparent about ingredients",
    body: "I appreciate that they list what goes in and keep the claims honest. The neem & tulsi soap is a staple for us.",
    product: "Neem & Tulsi Soap",
  },
];
