export interface Slider {
  id: number;
  title_en: string;
  title_ar: string;
  slug: string;
  image: string;
  slider_id: number;
  created_at: string;
}

export class SliderModel {
  id: number;
  title_en: string;
  title_ar: string;
  slug: string;

  constructor(editData: any) {
    this.id = editData.id;
    this.title_en = editData.title_en;
    this.title_ar = editData.title_ar;
    this.slug = editData.slug;
  }
}