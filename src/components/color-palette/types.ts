export type ColorCategory = 'all' | 'nude' | 'red' | 'dark' | 'bright' | 'pastel' | 'glitter';

export type ColorFinish = 'glossy' | 'matte' | 'shimmer' | 'reflective' | 'cat_eye';

export interface NailColor {
  id: string;
  title: string;
  shade_code: string;
  category: ColorCategory;
  swatch_image_url: string;     // Фото 1: образец/свотч цвета
  manicure_image_url: string;   // Фото 2: готовый маникюр с этим цветом
  color_hex?: string;           // HEX-код для цветного акцента
  finish?: ColorFinish;
  brand?: string;
  description?: string;
  created_at?: string;
}

export interface NewNailColorInput {
  title: string;
  shade_code: string;
  category: ColorCategory;
  swatch_image_url: string;
  manicure_image_url: string;
  color_hex?: string;
  finish?: ColorFinish;
  brand?: string;
  description?: string;
}
