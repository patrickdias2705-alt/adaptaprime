import { salesItemPath, type SalesItem } from "./sales-items";

const columns = ["id", "title", "description", "link", "image_link", "availability", "price", "brand", "mpn", "gtin",
  "condition", "identifier_exists", "product_type"] as const;

// The utm values only tell the WhatsApp message where the visit came from; they carry nothing personal.
const shoppingQuery = "?utm_source=google&utm_medium=shopping";

const cell = (value: string) => value.replace(/[\t\r\n]+/g, " ").trim();

export function buildMerchantFeed(items: SalesItem[], siteUrl: string) {
  const rows = items.map((item) => [
    item.id,
    item.title,
    item.summary,
    `${siteUrl}${salesItemPath(item)}${shoppingQuery}`,
    item.image ? `${siteUrl}${item.image}` : "",
    item.availability,
    `${item.priceBRL.toFixed(2)} BRL`,
    item.brand,
    item.mpn ?? "",
    item.gtin ?? "",
    "new",
    item.mpn || item.gtin ? "yes" : "no",
    item.category,
  ].map(cell).join("\t"));
  return [columns.join("\t"), ...rows].join("\n") + "\n";
}
