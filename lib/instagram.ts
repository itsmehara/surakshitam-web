/**
 * Instagram reels for the homepage feed.
 *
 * If `INSTAGRAM_ACCESS_TOKEN` is set, real media is pulled from the Instagram
 * Graph API server-side and auto-refreshes hourly. Otherwise the curated list
 * below is used (real photos from source-assets, links rotate across reels).
 * The token is read only on the server. See docs/INSTAGRAM_SETUP.md.
 */

export interface Reel {
  url: string;
  image: string;
  caption: string;
}

export const fallbackReels: Reel[] = [
  { url: "https://www.instagram.com/p/DYlvAlOOaaF/", image: "/reels/aloe-vera-soap.webp", caption: "Aloe Vera Soap" },
  { url: "https://www.instagram.com/p/DYhc9GXSXmr/", image: "/reels/beetroot-soap.webp", caption: "Beetroot Soap" },
  { url: "https://www.instagram.com/p/DZAkGfty11L/", image: "/reels/body-lotion.webp", caption: "Body Lotion" },
  { url: "https://www.instagram.com/p/DY1MQUayjIj/", image: "/reels/brand-features-banner.webp", caption: "Brand Features Banner" },
  { url: "https://www.instagram.com/p/Db_HCK2tbNp/", image: "/reels/brand-intro-poster.webp", caption: "Brand Intro Poster" },
  { url: "https://www.instagram.com/p/DcC0dWRy25u/", image: "/reels/brand-logo-3d.webp", caption: "Brand Logo 3D" },
  { url: "https://www.instagram.com/p/DaLfS7Hvcd8/", image: "/reels/charcoal-soap.webp", caption: "Charcoal Soap" },
  { url: "https://www.instagram.com/p/DYWPebHg1s9/", image: "/reels/coffee-soap.webp", caption: "Coffee Soap" },
  { url: "https://www.instagram.com/p/DV_h6x0kgbI/", image: "/reels/dish-wash-soap-tub.webp", caption: "Dish Wash Soap Tub" },
  { url: "https://www.instagram.com/p/DYlvAlOOaaF/", image: "/reels/dishwashing-liquid-bottle.webp", caption: "Dishwashing Liquid Bottle" },
  { url: "https://www.instagram.com/p/DYlvAlOOaaF/", image: "/reels/floor-cleaner-bottle.webp", caption: "Floor Cleaner Bottle" },
  { url: "https://www.instagram.com/p/DYhc9GXSXmr/", image: "/reels/floor-cleaner-poster.webp", caption: "Floor Cleaner Poster" },
  { url: "https://www.instagram.com/p/DZAkGfty11L/", image: "/reels/glycerine-soap.webp", caption: "Glycerine Soap" },
  { url: "https://www.instagram.com/p/DY1MQUayjIj/", image: "/reels/goat-milk-soap.webp", caption: "Goat Milk Soap" },
  { url: "https://www.instagram.com/p/Db_HCK2tbNp/", image: "/reels/hair-care-product-lineup.webp", caption: "Hair Care Product Lineup" },
  { url: "https://www.instagram.com/p/DcC0dWRy25u/", image: "/reels/handwash-liquid-bottle.webp", caption: "Natural Dishwashing Liquid" },
  { url: "https://www.instagram.com/p/DaLfS7Hvcd8/", image: "/reels/henna-powder-pack.webp", caption: "Henna Powder Pack" },
  { url: "https://www.instagram.com/p/DYWPebHg1s9/", image: "/reels/herbal-hair-oil-bottles.webp", caption: "Herbal Hair Oil Bottles" },
  { url: "https://www.instagram.com/p/DV_h6x0kgbI/", image: "/reels/herbal-hair-oil-poster.webp", caption: "Herbal Hair Oil Poster" },
  { url: "https://www.instagram.com/p/DYlvAlOOaaF/", image: "/reels/herbal-shampoo-poster.webp", caption: "Herbal Shampoo Poster" },
  { url: "https://www.instagram.com/p/DYlvAlOOaaF/", image: "/reels/honey-soap.webp", caption: "Honey Soap" },
  { url: "https://www.instagram.com/p/DYhc9GXSXmr/", image: "/reels/lip-balm-poster.webp", caption: "Lip Balm Poster" },
  { url: "https://www.instagram.com/p/DZAkGfty11L/", image: "/reels/lip-balm-quad-pots.webp", caption: "Lip Balm Quad Pots" },
  { url: "https://www.instagram.com/p/DY1MQUayjIj/", image: "/reels/lip-balm-sticks.webp", caption: "Lip Balm Sticks" },
  { url: "https://www.instagram.com/p/Db_HCK2tbNp/", image: "/reels/lip-balm-trio-closeup.webp", caption: "Lip Balm Trio Closeup" },
  { url: "https://www.instagram.com/p/DcC0dWRy25u/", image: "/reels/lip-balm-trio-wide.webp", caption: "Lip Balm Trio Wide" },
  { url: "https://www.instagram.com/p/DaLfS7Hvcd8/", image: "/reels/lip-balm-tubes-pair.webp", caption: "Lip Balm Tubes Pair" },
  { url: "https://www.instagram.com/p/DYWPebHg1s9/", image: "/reels/manistya-soap.webp", caption: "Manjista Soap" },
  { url: "https://www.instagram.com/p/DV_h6x0kgbI/", image: "/reels/neem-tulasi-soap-2.webp", caption: "Neem Tulasi Soap 2" },
  { url: "https://www.instagram.com/p/DYlvAlOOaaF/", image: "/reels/neem-tulasi-soap.webp", caption: "Neem Tulasi Soap" },
  { url: "https://www.instagram.com/p/DYlvAlOOaaF/", image: "/reels/papaya-soap.webp", caption: "Papaya Soap" },
  { url: "https://www.instagram.com/p/DYhc9GXSXmr/", image: "/reels/participation-certificate.webp", caption: "Participation Certificate" },
  { url: "https://www.instagram.com/p/DZAkGfty11L/", image: "/reels/pitambari-powder-bowl-1.webp", caption: "Pitambari Powder Bowl 1" },
  { url: "https://www.instagram.com/p/DY1MQUayjIj/", image: "/reels/pitambari-powder-bowl-2.webp", caption: "Pitambari Powder Bowl 2" },
  { url: "https://www.instagram.com/p/Db_HCK2tbNp/", image: "/reels/pitambari-powder-pack.webp", caption: "Pitambari Powder Pack" },
  { url: "https://www.instagram.com/p/DcC0dWRy25u/", image: "/reels/red-wine-soap.webp", caption: "Red Wine Soap" },
  { url: "https://www.instagram.com/p/DaLfS7Hvcd8/", image: "/reels/salt-making-certificate.webp", caption: "Salt Making Certificate" },
  { url: "https://www.instagram.com/p/DYWPebHg1s9/", image: "/reels/sandal-soap.webp", caption: "Sandal Soap" },
  { url: "https://www.instagram.com/p/DV_h6x0kgbI/", image: "/reels/sheabutter-soap.webp", caption: "Shea Butter Soap" },
  { url: "https://www.instagram.com/p/DYlvAlOOaaF/", image: "/reels/triple-butter-soap.webp", caption: "Triple Butter Soap" },
  { url: "https://www.instagram.com/p/DYlvAlOOaaF/", image: "/reels/world-record-certificate.webp", caption: "World Record Certificate" },
];

interface IgMedia {
  media_type?: string;
  media_url?: string;
  thumbnail_url?: string;
  permalink?: string;
  caption?: string;
}

export async function getInstagramReels(limit = 24): Promise<Reel[]> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const userId = process.env.INSTAGRAM_USER_ID || "me";
  if (!token) return fallbackReels;
  try {
    const fields = "media_type,media_url,thumbnail_url,permalink,caption";
    const endpoint = `https://graph.instagram.com/${userId}/media?fields=${fields}&limit=${limit}&access_token=${token}`;
    const res = await fetch(endpoint, { next: { revalidate: 3600 } });
    if (!res.ok) return fallbackReels;
    const data = (await res.json()) as { data?: IgMedia[] };
    const reels: Reel[] = (data.data ?? [])
      .map((m) => ({
        url: m.permalink ?? "",
        image: m.thumbnail_url || m.media_url || "",
        caption: (m.caption?.split("\n")[0] || "Watch on Instagram").slice(0, 48),
      }))
      .filter((r) => r.url && r.image);
    return reels.length ? reels : fallbackReels;
  } catch {
    return fallbackReels;
  }
}
