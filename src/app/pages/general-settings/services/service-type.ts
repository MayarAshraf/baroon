export interface GeneralSetting {
  id: number;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  default_value: string;
  value_en: string;
  value_ar: string;
  icon: string;
  featured_image: string;
  order: number;
  screen_shot: File;
  slug: string;
}

export class GeneralSettingModel {
  id: number | null;
  title_en: string | null;
  title_ar: string | null;
  description_en: string | null;
  description_ar: string | null;
  default_value: string | null;
  value_en: string | null;
  value_ar: string | null;
  icon: string | null;
  featured_image: string | null;
  order: number | null;
  screen_shot?: File | null;
  slug: string | null;

  constructor(editData?: GeneralSetting) {
    this.id = editData?.id || null;
    this.title_en = editData?.title_en || null;
    this.title_ar = editData?.title_ar || null;
    this.description_en = editData?.description_en || null;
    this.description_ar = editData?.description_ar || null;
    this.default_value = editData?.default_value || null;
    this.value_en = editData?.value_en || null;
    this.value_ar = editData?.value_ar || null;
    this.icon = editData?.icon || null;
    this.featured_image = editData?.featured_image || null;
    this.order = editData?.order || null;
    this.screen_shot = editData?.screen_shot || null;
    this.slug = editData?.slug || null;
  }
}
