export interface lookup {
  id: number;
  name_en: string;
  name_ar: string;
  order: number;
  slug: string;
  description_en: string;
  description_ar: string;
  created_at: string;
  is_deletable:boolean;
  parent: {
    name_en: string;
    name_ar: string;
    [key: `name_${string}`]: string;
  };
}

export class lookupModel {
  id?: number | null;
  parent_id: number | null;
  name_en?: string | null;
  name_ar?: string | null;
  order?: number | null;
  slug?: string | null;
  constructor(editaData?: lookupModel) {
    this.id = editaData?.id || null;
    this.parent_id = editaData?.parent_id || null;
    this.name_en = editaData?.name_en || null;
    this.name_ar = editaData?.name_ar || null;
    this.order = editaData?.order || null;
    this.slug = editaData?.slug || null;
  }
}
