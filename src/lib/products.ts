/**
 * Catalogue produits MIFA Life — source of truth pour les pages
 * collections & détail produit.
 */

export interface Product {
  id: string
  name: string
  price: number
  category: string
  emoji: string
  bg: string
  image?: string
  description: string
  details: string[]
  sizes?: string[]
  inStock: boolean
}

export const PRODUCTS: Product[] = [
  {
    id: 'robe-kente-exception',
    name: "Robe Kente d'exception",
    price: 85000,
    category: 'Kente',
    emoji: '👗',
    bg: 'linear-gradient(135deg, #2d1b5e 0%, #1a0d3a 100%)',
    description:
      "Tissée à la main selon les techniques ancestrales ashanti, cette robe Kente est un chef-d'œuvre de l'artisanat africain. Les bandes de tissu entrelacées forment des motifs géométriques riches en symboles et en couleurs vives qui traversent les générations.",
    details: [
      'Tissu Kente 100 % coton tissé à la main, bandes de 5 cm',
      'Motifs géométriques adinkra symbolisant prospérité et royauté',
      'Fermeture invisible sur le côté, finitions surpiquées soignées',
      'Teinture naturelle garantie sans décoloration après lavage',
      'Livraison sous 5–7 jours ouvrés depuis Bamako, emballage cadeau inclus',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
  },
  {
    id: 'dashiki-brode-bogolan',
    name: 'Dashiki brodé Bogolan',
    price: 45000,
    category: 'Dashhiki',
    emoji: '🧣',
    bg: 'linear-gradient(135deg, #5e2d1b 0%, #3a1a0d 100%)',
    description:
      "Inspiré du bogolan malien traditionnel, ce dashiki allie broderies fines et imprimés en terre d'ocre. Porté par les hommes et femmes d'Afrique de l'Ouest depuis des siècles, il incarne l'élégance décontractée à la croisée de la tradition et de la modernité.",
    details: [
      'Coton bogolan tissé et teint à la terre selon la tradition malienne',
      'Col en V brodé à la main avec fil de soie doré, motifs exclusifs',
      'Motifs géométriques bogolan uniques, aucune pièce identique',
      'Lavable à 30 °C, séchage à plat recommandé pour préserver la couleur',
      'Disponible en taille standard ou en sur-mesure (délai +7 jours)',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
  },
  {
    id: 'ensemble-wax-premium',
    name: 'Ensemble Wax Print Premium',
    price: 65000,
    category: 'Tenues',
    emoji: '✨',
    bg: 'linear-gradient(135deg, #1b3d5e 0%, #0d2540 100%)',
    description:
      "Cet ensemble deux pièces en wax hollandais authentique marie modernité et tradition africaine avec un sens aigu de la couleur. La veste corsetée et le pantalon droit palazzo sont taillés pour sublimer toutes les silhouettes lors des grandes occasions.",
    details: [
      'Wax hollandais certifié, 100 % coton impression double face',
      'Ensemble 2 pièces : veste corsetée et pantalon palazzo coordonnés',
      'Broderies contrastantes fil d\'or sur les poignets et ourlets',
      'Doublure intérieure en soie synthétique légère et respirante',
      'Idéal pour cérémonies, mariages et sorties de prestige',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    inStock: true,
  },
  {
    id: 'foulard-kente-or-vert',
    name: 'Foulard Kente or et vert',
    price: 18000,
    category: 'Accessoires',
    emoji: '🧤',
    bg: 'linear-gradient(135deg, #1b5e2d 0%, #0d3a1b 100%)',
    description:
      "Ce foulard kente aux couleurs or et vert du drapeau malien est tissé en étroite bande selon la méthode ancestrale du peuple akan. Porté en écharpe, noué en turban ou drapé sur une épaule, il transforme instantanément n'importe quelle tenue.",
    details: [
      'Kente authentique tissé à la main, dimensions 15 cm × 180 cm',
      'Couleurs vives or, vert et rouge résistantes à 40 lavages',
      'Franges torsadées à la main sur chaque extrémité',
      'Polyvalent : écharpe, turban, ceinture ou bandeau',
      'Emballage cadeau kraft offert avec carte explicative des symboles kente',
    ],
    inStock: true,
  },
  {
    id: 'boubou-grand-bazin',
    name: 'Boubou grand Bazin',
    price: 120000,
    category: 'Tenues',
    emoji: '🥷',
    bg: 'linear-gradient(135deg, #3d1b5e 0%, #250d3a 100%)',
    description:
      "Le boubou grand bazin est le vêtement de prestige par excellence en Afrique de l'Ouest. Confectionné dans un bazin riche damassé et entièrement brodé à la main par des artisans maliens, il habille avec majesté les grandes cérémonies.",
    details: [
      'Bazin riche 100 % coton damassé importé, lustre naturel exceptionnel',
      'Broderies richelieu et punto exécutées au fil d\'or sur col, manches et bas',
      'Coupe ample traditionnelle, longueur au sol pour un port majestueux',
      'Couleurs personnalisées disponibles sur commande (délai +10 jours)',
      'Livraison avec pantalon assorti et babouches brodées coordonnées',
    ],
    sizes: ['M', 'L', 'XL', 'XXL', 'Sur mesure'],
    inStock: true,
  },
  {
    id: 'pagne-wax-ankara',
    name: 'Pagne wax Ankara',
    price: 25000,
    category: 'Tissu wax',
    emoji: '🎭',
    bg: 'linear-gradient(135deg, #5e3d1b 0%, #3a250d 100%)',
    description:
      "Ce pagne wax Ankara d'une longueur de 6 yards présente des motifs floraux et géométriques caractéristiques du style Ankara nigérian. Vif, chatoyant et résistant, il est le matériau de choix pour toutes vos créations sur mesure.",
    details: [
      '6 yards (≈ 5,5 m) de wax 100 % coton double face haute densité',
      'Impression cire traditionnelle, motifs Ankara en couleurs vives',
      'Couleurs certifiées pour 40 lavages minimum à 30 °C',
      'Idéal pour robes, ensembles, turbans, sacs et décorations',
      'Certificat d\'authenticité wax hollandais inclus dans chaque colis',
    ],
    inStock: true,
  },
  {
    id: 'sandales-sculptees',
    name: 'Sandales sculptées artisanales',
    price: 35000,
    category: 'Accessoires',
    emoji: '👡',
    bg: 'linear-gradient(135deg, #1b5e4d 0%, #0d3a2f 100%)',
    description:
      "Fabriquées à la main par des cordonniers maliens de Bamako, ces sandales en cuir de vachette pleine fleur combinent confort, robustesse et esthétique africaine. Les motifs gravés s'inspirent des masques dogon de la falaise de Bandiagara.",
    details: [
      'Cuir de vachette pleine fleur, tannage végétal naturel respectueux',
      'Semelle intérieure en liège recouvert de cuir pour absorption des chocs',
      'Motifs dogon gravés à la main sur chaque sangle',
      'Sangle réglable avec boucle en laiton massif pour un maintien parfait',
      'Semelle extérieure en caoutchouc naturel antidérapant, durable',
    ],
    sizes: ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'],
    inStock: true,
  },
  {
    id: 'chemise-kente-homme',
    name: 'Chemise Kente homme',
    price: 55000,
    category: 'Tenues',
    emoji: '👔',
    bg: 'linear-gradient(135deg, #1b4d5e 0%, #0d2f3a 100%)',
    description:
      "Cette chemise pour homme intègre des bandes de kente authentique sur les épaules et le col, créant un contraste élégant avec le tissu uni. Le résultat est un vêtement contemporain à fort caractère africain, parfait pour le bureau ou les occasions formelles.",
    details: [
      'Corps en coton popeline peigné blanc ou ivoire, matière premium',
      'Bandes kente authentiques tissées à la main cousues sur col et épaulettes',
      'Boutons en ivoire végétal poli gravés d\'un motif adinkra',
      'Coupe slim moderne, manches longues retroussables avec bouton de manchette',
      'Poche poitrine avec pochette en kente coordonnée incluse',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
  },
  {
    id: 'robe-wrap-wax',
    name: 'Robe wrap Wax',
    price: 72000,
    category: 'Robes',
    emoji: '👘',
    bg: 'linear-gradient(135deg, #5e1b3d 0%, #3a0d25 100%)',
    description:
      "La robe wrap en wax est l'incontournable de la garde-robe africaine moderne. Son imprimé wax aux teintes bordeaux et mauve se marie à une coupe portefeuille flatteuse, mettant en valeur toutes les morphologies pour toutes les occasions.",
    details: [
      'Wax hollandais bordeaux et mauve, impression batik thermique haute définition',
      'Coupe portefeuille ajustable avec ceinture intégrée en tissu assorti',
      'Décolleté en V élégant, manches 3/4 avec revers brodés',
      'Doublure en coton léger pour un confort optimal en toute saison',
      'Finitions surpiquées en fil d\'or contrastant, ourlet festonné',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
  },
]
