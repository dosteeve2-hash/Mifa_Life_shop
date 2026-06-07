import { readFile } from "node:fs/promises";
import path from "node:path";

const stitchDirectory = path.join(
  process.cwd(),
  "stitch_mifa_life",
  "stitch_mifa_life",
);

const stitchPageFiles = {
  // Core pages
  home: "accueil_mifa_life_unified_3/code.html",
  shop: "boutique_avanc_e_mifa_life/code.html",
  product: "mifa_life_page_produit_l_action/code.html",
  cart: "panier_mifa_life_unified/code.html",
  checkout: "panier_paiement_s_curis_mifa_life/code.html",
  // Info pages
  about: "l_me_de_mifa_life_propos_quipe/code.html",
  contact: "propos_contact_mifa_life/code.html",
  faq: "centre_d_aide_faq_mifa_life/code.html",
  track: "suivi_de_commande_d_taill/code.html",
  sellerRegister: "devenir_vendeur_mifa_life/code.html",
  privacy: "conditions_confidentialit_mifa_life/code.html",
  // User account
  account: "compte_mifa_life_unified/code.html",
  wishlist: "ma_liste_de_souhaits_mifa_life/code.html",
  orders: "mes_commandes_mifa_life/code.html",
  profile: "modifier_le_profil_mifa_life/code.html",
  dashboard: "tableau_de_bord_suivi_de_commande_mifa_life/code.html",
  // Seller
  sellerDashboard: "tableau_de_bord_vendeur_mifa_life/code.html",
  // Admin
  adminDashboard: "tableau_de_bord_super_admin_mifa_life/code.html",
  // Categories
  categoryFood: "cat_gorie_alimentation_mifa_life/code.html",
  categoryBeauty: "cat_gorie_beaut_mifa_life/code.html",
  categoryHome: "cat_gorie_maison_mifa_life/code.html",
  categoryFashion: "cat_gorie_mode_mifa_life/code.html",
  categoryTech: "cat_gorie_tech_mifa_life/code.html",
  // Blog / social
  blog: "mifa_social_engagement_blog_notifications/code.html",
  // Shopping assistant
  assistant: "assistant_shopping_mifa_life/code.html",
  // Essentials / promos
  essentials: "mes_essentiels_mifa_life/code.html",
} as const;

export type StitchPageKey = keyof typeof stitchPageFiles;

const screenRouteMap: Record<string, string> = {
  SCREEN_5: "/shop/featured",
  SCREEN_16: "/shop?cat=alimentation",
  SCREEN_29: "/cart",
  SCREEN_41: "/blog",
  SCREEN_58: "/",
  SCREEN_75: "/shop",
  SCREEN_79: "/shop?cat=beaute",
  SCREEN_84: "/login",
};

function rewriteNavAnchor(html: string, label: string, href: string) {
  const pattern = new RegExp(
    `<a([^>]*?)href=(["'])#\\2([^>]*)>\\s*${label}\\s*</a>`,
    "gi",
  );
  return html.replace(
    pattern,
    `<a$1href="${href}" target="_top"$3>${label}</a>`,
  );
}

function rewriteStitchPlaceholders(html: string) {
  let rewritten = html;
  for (const [screenId, route] of Object.entries(screenRouteMap)) {
    rewritten = rewritten.replaceAll(`{{DATA:SCREEN:${screenId}}}`, route);
  }
  rewritten = rewritten
    .replace(/window\.location\.href/g, "window.top.location.href")
    .replace(/(?<!\.)location\.href/g, "window.top.location.href");
  return rewritten;
}

function rewriteTextAnchors(html: string) {
  let rewritten = html;
  const labels: Array<[string, string]> = [
    ["Home", "/"],
    ["Accueil", "/"],
    ["Shop", "/shop"],
    ["Boutique", "/shop"],
    ["Cart", "/cart"],
    ["Panier", "/cart"],
    ["Checkout", "/checkout"],
    ["Account", "/account"],
    ["Mon compte", "/account"],
    ["Connexion", "/login"],
    ["Se connecter", "/login"],
    ["Contact", "/contact"],
    ["FAQ", "/faq"],
    ["Track Order", "/track"],
    ["Suivi commande", "/track"],
    ["Privacy", "/privacy"],
    ["Terms", "/privacy"],
    ["Cookies", "/privacy"],
    ["Confidentialité", "/privacy"],
    ["New Arrivals", "/shop"],
    ["Nouveautés", "/shop"],
    ["Best Sellers", "/shop"],
    ["Mali Pulse", "/blog"],
    ["Blog", "/blog"],
    ["Artisan Stories", "/about"],
    ["À propos", "/about"],
    ["Shipping Policy", "/checkout"],
    ["Return Center", "/returns"],
    ["Retours", "/returns"],
    ["Wishlist", "/wishlist"],
    ["Liste de souhaits", "/wishlist"],
    ["Mes commandes", "/orders"],
    ["Vendeur", "/seller-register"],
    ["Devenir vendeur", "/seller-register"],
    ["Assistant", "/assistant"],
  ];
  for (const [label, href] of labels) {
    rewritten = rewriteNavAnchor(rewritten, label, href);
  }
  return rewritten;
}

function rewriteAnchors(html: string) {
  return html.replace(
    /<a([^>]*?)href=(["'])([^"']+)\2([^>]*)>/gi,
    (match, before, quote, href, after) => {
      if (
        href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("javascript:")
      ) {
        return match;
      }
      const nextHref = href === "#" ? "/shop" : href;
      const target = /target=/i.test(after) ? "" : ` target=${quote}_top${quote}`;
      return `<a${before}href=${quote}${nextHref}${quote}${target}${after}>`;
    },
  );
}

export function rewriteStitchHtml(html: string) {
  return rewriteAnchors(rewriteTextAnchors(rewriteStitchPlaceholders(html)));
}

export async function getStitchPageHtml(page: StitchPageKey) {
  const rawHtml = await readFile(
    path.join(stitchDirectory, stitchPageFiles[page]),
    "utf8",
  );
  return rewriteStitchHtml(rawHtml);
}
