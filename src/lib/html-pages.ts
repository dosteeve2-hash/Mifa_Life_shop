import { readFile } from "node:fs/promises";
import path from "node:path";

const htmlDirectory = path.join(process.cwd(), "Mes pages html");

const legacyPageFiles = {
  about: "about.html",
  blog: "blog.html",
  categories: "categories.html",
  checkout: "checkout.html",
  comparateur: "comparateur.html",
  contact: "contact.html",
  faq: "faq.html",
  flash: "flash.html",
  "gift-cards": "gift-cards.html",
  notifications: "notifications.html",
  promo: "promo.html",
  returns: "returns.html",
  "seller-register": "seller-register.html",
  "sizing-guide": "sizing-guide.html",
  track: "Track.html",
} as const;

export type LegacyPageSlug = keyof typeof legacyPageFiles;

const legacyRouteOverrides: Record<string, string> = {
  auth: "/login",
  catalogue: "/shop",
  dashboard: "/admin",
  index: "/",
  "index.html": "/",
  "index.html.html": "/",
};

function mapLegacyPathname(target: string) {
  const cleanTarget = target.trim();
  const normalized = cleanTarget.replace(/^\.\//, "").replace(/^\/+/, "");
  const [pathname, query = ""] = normalized.split("?");
  const lowerPathname = pathname.toLowerCase();

  if (!pathname) {
    return target;
  }

  if (lowerPathname === "produit" && query) {
    const params = new URLSearchParams(query);
    const id = params.get("id");
    return id ? `/shop/${id}` : "/shop";
  }

  if (lowerPathname in legacyRouteOverrides) {
    const rewritten = legacyRouteOverrides[lowerPathname];
    return query ? `${rewritten}?${query}` : rewritten;
  }

  if (lowerPathname.endsWith(".html")) {
    const withoutExtension = lowerPathname.replace(/\.html$/i, "");
    if (withoutExtension in legacyRouteOverrides) {
      const rewritten = legacyRouteOverrides[withoutExtension];
      return query ? `${rewritten}?${query}` : rewritten;
    }

    return query ? `/${withoutExtension}?${query}` : `/${withoutExtension}`;
  }

  return cleanTarget.startsWith("/") ? cleanTarget : `/${cleanTarget}`;
}

function rewriteLegacyAnchors(html: string) {
  return html.replace(/href=(["'])([^"']+)\1/gi, (match, quote, href) => {
    if (
      href.startsWith("#") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      href.startsWith("javascript:") ||
      href.startsWith("data:") ||
      href.startsWith("http://") ||
      href.startsWith("https://")
    ) {
      return match;
    }

    const rewrittenHref = mapLegacyPathname(href);
    return `href=${quote}${rewrittenHref}${quote} target=${quote}_top${quote}`;
  });
}

function rewriteLegacyNavigation(html: string) {
  return html
    .replaceAll("window.location.href = '/produit?id='+id;", "window.top.location.href = '/shop/'+id;")
    .replaceAll("window.location.href='/produit?id='+id;", "window.top.location.href='/shop/'+id;")
    .replaceAll("location.href='/produit?id='+id;", "window.top.location.href='/shop/'+id;")
    .replaceAll("window.location.href = '/catalogue", "window.top.location.href = '/shop")
    .replaceAll("window.location.href='/catalogue", "window.top.location.href='/shop")
    .replaceAll("location.href='/catalogue", "window.top.location.href='/shop");
}

export function rewriteLegacyHtml(html: string) {
  return rewriteLegacyNavigation(rewriteLegacyAnchors(html));
}

export async function getLegacyPageHtml(slug: LegacyPageSlug) {
  const fileName = legacyPageFiles[slug];
  const rawHtml = await readFile(path.join(htmlDirectory, fileName), "utf8");
  return rewriteLegacyHtml(rawHtml);
}

export function isLegacyPageSlug(value: string): value is LegacyPageSlug {
  return value in legacyPageFiles;
}

export function getLegacyPageSlugs() {
  return Object.keys(legacyPageFiles) as LegacyPageSlug[];
}
