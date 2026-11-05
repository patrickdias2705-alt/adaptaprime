import { buildMerchantFeed } from "@/lib/merchant-feed";
import { salesItems } from "@/lib/sales-items";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-static";

export function GET() {
  return new Response(buildMerchantFeed(salesItems, siteConfig.siteUrl), {
    headers: { "Content-Type": "text/tab-separated-values; charset=utf-8" },
  });
}
