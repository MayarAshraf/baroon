export interface Career {
  id: number;
  slug: string;
  type: string;
  salary_range: number[];
  number_of_available_vacancies: number;
  closed_at: string;
  title_en: string;
  title_ar: string;
  description_ar: string;
  description_en: string;
  min_salary: number;
  max_salary: number;
}

export class CareerModel {
  id?: number | null;
  title_en: string | null;
  title_ar: string | null;
  meta_title_en: string | null;
  meta_title_ar: string | null;
  meta_description_en: string | null;
  meta_description_ar: string | null;
  description_en: string | null;
  description_ar: string | null;
  number_of_available_vacancies: number | null;
  type: string | null;
  salary_range: number[] | null;
  show_salary: number | null;
  slug: string | null;
  closed_at: string | null;
  min_salary: number | null = null;
  max_salary: number | null = null;
  constructor(editData?: CareerModel) {
    this.id = editData?.id || null;
    this.title_en = editData?.title_en || null;
    this.title_ar = editData?.title_ar || null;
    this.show_salary = editData?.show_salary || null;
    this.meta_title_en = editData?.meta_title_en || null;
    this.meta_title_ar = editData?.meta_title_ar || null;
    this.meta_description_en = editData?.meta_description_en || null;
    this.meta_description_ar = editData?.meta_description_ar || null;
    this.description_ar = editData?.description_ar || null;
    this.description_en = editData?.description_en || null;
    this.number_of_available_vacancies =
      editData?.number_of_available_vacancies || null;
    this.type = editData?.type || null;
    this.salary_range = editData?.salary_range || null;
    this.min_salary = this.salary_range ? this.salary_range[0] : null;
    this.max_salary = this.salary_range ? this.salary_range[1] : null;
    this.slug = editData?.slug || null;
    this.closed_at = editData?.closed_at || null;
  }
}
