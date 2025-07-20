export interface Applicant {
  id: number;
  name_en: string;
  name_ar: string;
  email: string;
  phone: string;
  status: number;
  slug: string;
}

export class ApplicantModel {
  id: number | null;
  name_en: string | null;
  name_ar: string | null;
  email: string | null;
  phone: string | null;
  status: string | null;
  slug: string | null;
  attachments: string | null;

  constructor(editData?: ApplicantModel) {
    this.id = editData?.id || null;
    this.name_en = editData?.name_en || null;
    this.name_ar = editData?.name_ar || null;
    this.email = editData?.email || null;
    this.phone = editData?.phone || null;
    this.status = editData?.status || null;
    this.slug = editData?.slug || null;
    this.attachments = editData?.attachments || null;
  }
}
