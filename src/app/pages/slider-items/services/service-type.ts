export interface sliderItems {
  id: number;
  title_en: string;
  title_ar: string;
  subtitle_en: string;
  subtitle_ar: string;
  description_en: string;
  description_ar: string;
  order: number;
  link: string;
  slider_id: number;
  image: string;
  thumb: string;
  created_at: string;
}

export class SliderItemsModel {
  id?: number | null;
  title_en: string | null;
  title_ar: string | null;
  project_id: number | null;
  project: any;
  subtitle_en: string | null;
  subtitle_ar: string | null;
  description_en: string | null;
  description_ar: string | null;
  order: number | null;
  link: string | null;
  slider_id: number | null;
  image: File | null | null;

  constructor(editData?: SliderItemsModel, lang?: string) {
    this.id = editData?.id || null;
    this.project_id = editData?.project_id || null;
    // this.project = {
    //   label: (editData?.project)[`title_${lang}`],
    //   value: editData?.project.id,
    // };
    this.project = editData?.project
      ? {
          label: editData.project[`title_${lang}`],
          value: editData.project.id,
        }
      : { label: null, value: null };
    this.title_en = editData?.title_en || null;
    this.title_ar = editData?.title_ar || null;
    this.subtitle_en = editData?.subtitle_en || null;
    this.subtitle_ar = editData?.subtitle_ar || null;
    this.description_en = editData?.description_en || null;
    this.description_ar = editData?.description_ar || null;
    this.order = editData?.order || null;
    this.link = editData?.link || null;
    this.slider_id = editData?.slider_id || null;
    this.image = editData?.image || null;
  }
}
