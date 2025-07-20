export interface Blog {
  id: number;
  order: number;
  video_type: string;
  video: string;
  views: number;
  is_featured: boolean;
  is_published: boolean;
  start_date: string;
  end_date: string | null;
  title_en: string;
  title_ar: string;
  sub_title_en: string;
  sub_title_ar: string;
  slug: string;
  description_en: string;
  description_ar: string;
  short_description_en: string;
  short_description_ar: string;
  meta_title_en: string | null;
  meta_title_ar: string | null;
  meta_description_en: string;
  meta_description_ar: string;
  image: string;
  thumb: string;
  media_type: string;
  created_at: string;
  updated_at: string;
  created_since: string;
  updated_since: string;
}

export class BlogModel {
  id: number | null;
  order: number | null;
  video_type: string | null;
  video: string | null;
  views: number | null;
  is_featured: boolean | null;
  is_published: boolean | null;
  start_date: string | null;
  end_date: string | null;
  title_en: string | null;
  title_ar: string | null;
  sub_title_en: string | null;
  sub_title_ar: string | null;
  slug: string | null;
  description_en: string | null;
  description_ar: string | null;
  short_description_en: string | null;
  short_description_ar: string | null;
  meta_title_en: string | null;
  meta_title_ar: string | null;
  meta_description_en: string | null;
  meta_description_ar: string | null;
  image: string | null;
  thumb: string | null;
  media_type: string | null;

  constructor(editData?: BlogModel) {
    this.id = editData?.id || null;
    this.order = editData?.order || null;
    this.video_type = editData?.video_type || null;
    this.video = editData?.video || null;
    this.views = editData?.views || null;
    this.is_featured = editData?.is_featured || null;
    this.is_published = editData?.is_published || null;
    this.start_date = editData?.start_date || null;
    this.end_date = editData?.end_date || null;
    this.title_en = editData?.title_en || null;
    this.title_ar = editData?.title_ar || null;
    this.sub_title_en = editData?.sub_title_en || null;
    this.sub_title_ar = editData?.sub_title_ar || null;
    this.slug = editData?.slug || null;
    this.description_en = editData?.description_en || null;
    this.description_ar = editData?.description_ar || null;
    this.short_description_en = editData?.short_description_en || null;
    this.short_description_ar = editData?.short_description_ar || null;
    this.meta_title_en = editData?.meta_title_en || null;
    this.meta_title_ar = editData?.meta_title_ar || null;
    this.meta_description_en = editData?.meta_description_en || null;
    this.meta_description_ar = editData?.meta_description_ar || null;
    this.image = editData?.image || null;
    this.thumb = editData?.thumb || null;
    this.media_type = editData?.media_type || null;
  }
}

export interface list {
  id: number;
  title: string;
}
