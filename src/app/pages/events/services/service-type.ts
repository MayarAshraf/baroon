export interface Event {
  id: number;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  start_date: Date;
  end_date: Date;
  image: string;
}

export class EventModel {
  id?: number | null;
  title_en: string | null;
  title_ar: string | null;
  slug: string | null;
  description_en: string | null;
  description_ar: string | null;
  start_date: Date | null;
  end_date: Date | null;
  image: File | null;
  event_video_iframe: string[] | [null];
  event_video_url: string[] | [null];

  constructor(editData?: EventModel) {
    this.id = editData?.id || null;
    this.title_en = editData?.title_en || null;
    this.title_ar = editData?.title_ar || null;
    this.slug = editData?.slug || null;
    this.description_en = editData?.description_en || null;
    this.description_ar = editData?.description_ar || null;
    this.start_date = editData?.start_date || null;
    this.end_date = editData?.end_date || null;
    this.image = editData?.image || null;
    this.event_video_iframe = editData?.event_video_iframe || [null];
    this.event_video_url = editData?.event_video_url || [null];
  }
}
