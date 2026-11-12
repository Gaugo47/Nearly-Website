import { blogFeed } from "../machine-readable";

export const dynamic = "force-static";

export function GET() {
  return new Response(blogFeed("fr"), { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
