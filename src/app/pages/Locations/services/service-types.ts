export interface Location {
  id: number;
  name_en: string;
  name_ar: string;
  slug: string;
  order: number;
  code: number;
  is_active: 0;
  no_redirect?: number;
  parent_id?: number;
}

export class LocationModel {
  id?: number | null;
  name_en: string | null;
  name_ar: string | null;
  slug: string | null;
  order: number;
  code: number | null;
  is_active: 0 | 1;
  no_redirect?: number | null;
  parent_id?: number | null;

  constructor(editData?: LocationModel) {
    this.name_en = editData?.name_en || null;
    this.name_ar = editData?.name_ar || null;
    this.slug = editData?.slug || null;
    this.order = editData?.order || 0;
    this.code = editData?.code || null;
    this.is_active = editData?.is_active ?? 1;
  }
}
