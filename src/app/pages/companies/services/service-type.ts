export interface Company {
  id: number;
  name_en: string;
  name_ar: string;
}

export class CompanyModel {
  id: number | null;
  name_en: string | null;
  name_ar: string | null;
  description_en: string | null;
  description_ar: string | null;
  logo: File[] | null;

  constructor(editData?: CompanyModel) {
    this.id = editData?.id || null;
    this.name_en = editData?.name_en || null;
    this.name_ar = editData?.name_ar || null;
    this.description_en = editData?.description_en || null;
    this.description_ar = editData?.description_ar || null;
    this.logo = editData?.logo || null;
  }
}
