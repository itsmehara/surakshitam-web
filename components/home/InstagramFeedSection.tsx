import { getInstagramReels } from "@/lib/instagram";
import { InstagramFeed } from "./InstagramFeed";

/** Server component: fetches real reels (if a token is configured) and renders the feed. */
export async function InstagramFeedSection() {
  const reels = await getInstagramReels();
  return <InstagramFeed reels={reels} />;
}
