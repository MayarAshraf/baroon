export class lookupChildModel {
  id?: number | null;
  attributes?: string[] | null;
  parent_id: number | null;
  name_en?: string | null;
  name_ar?: string | null;
  order?: number | null;
  slug?: string | null;
  image?: File | null;
  is_default?: boolean | null;
  constructor(editaData?: lookupChildModel) {
    this.id = editaData?.id || null;
    this.attributes = editaData?.attributes || null;
    this.parent_id = editaData?.parent_id || null;
    this.name_en = editaData?.name_en || null;
    this.name_ar = editaData?.name_ar || null;
    this.order = editaData?.order || null;
    this.slug = editaData?.slug || null;
    this.image = editaData?.image || null;
    this.is_default = editaData?.is_default || null;
  }
}
