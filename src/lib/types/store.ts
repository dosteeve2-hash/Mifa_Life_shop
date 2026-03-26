export type ShopProduct = {
  id: string;
  name: string | null;
  price_cfa: number | null;
  image_url: string | null;
  description: string | null;
  active?: boolean | null;
};
