export interface UnitTypes {
  id: number;
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  area_from: number;
  area_to: number;
  price_from: string;
  price_to: string;
  area_unit_id: number | null;
  down_payment: string | null;
  number_of_installments_months: number | null;
  number_of_installments_months_to: number | null;
  order: number;
  featured_image: string;
  slider: string | null;
  created_at: string;
}

export class UnitTypesModel {
  id?: number | null;
  project_id: number | null;
  name_en: string | null;
  name_ar: string | null;
  description_en: string | null;
  description_ar: string | null;
  area_from: number | null;
  area_to: number | null;
  price_from: number | null;
  price_to: number | null;
  down_payment: number | null;
  bathroom_from: number | null;
  bathroom_to: number | null;
  bedroom_from: number | null;
  bedroom_to: number | null;
  number_of_units: number | null;
  bedroom_to_id: number | null;
  area_unit_id: number | null;
  currency_id: number | null;
  bedroom_from_id: number | null;
  purpose_type_id: number | null;
  furnishing_status_ids: number[] | [];
  finishing_type_ids: number[] | [];
  payment_method_ids: number[] | [];
  amenity_ids: number[] | [];
  facility_ids: number[] | [];
  service_ids: number[] | [];
  view_ids: number[] | [];
  offering_type_ids: number[] | [];
  featured_image: File | null;
  number_of_installments_years_from: number | null;
  number_of_installments_years_to: number | null;
  order: number | null;

  constructor(editData?: UnitTypesModel, lang?: string) {
    this.id = editData?.id || null;
    this.project_id = editData?.project_id || null;
    this.amenity_ids = editData?.amenity_ids || [];
    this.service_ids = editData?.service_ids || [];
    this.view_ids = editData?.view_ids || [];
    this.facility_ids = editData?.facility_ids || [];
    this.purpose_type_id = editData?.purpose_type_id || null;
    this.offering_type_ids = editData?.offering_type_ids || [];
    this.bathroom_from = editData?.bathroom_from || null;
    this.bathroom_to = editData?.bathroom_to || null;
    this.bedroom_from = editData?.bedroom_from || null;
    this.bedroom_to = editData?.bedroom_to || null;
    this.number_of_units = editData?.number_of_units || null;
    this.currency_id = editData?.currency_id || null;
    this.furnishing_status_ids = editData?.furnishing_status_ids || [];
    this.finishing_type_ids = editData?.finishing_type_ids || [];
    this.bedroom_from_id = editData?.bedroom_from_id || null;
    this.payment_method_ids = editData?.payment_method_ids || [];
    this.bedroom_to_id = editData?.bedroom_to_id || null;
    this.area_unit_id = editData?.area_unit_id || null;
    this.name_en = editData?.name_en || null;
    this.name_ar = editData?.name_ar || null;
    this.description_en = editData?.description_en || null;
    this.description_ar = editData?.description_ar || null;
    this.area_from = editData?.area_from || 0;
    this.area_to = editData?.area_to || 0;
    this.price_from = editData?.price_from || null;
    this.price_to = editData?.price_to || null;
    this.down_payment = editData?.down_payment || null;
    this.number_of_installments_years_from =
      editData?.number_of_installments_years_from || null;
    this.number_of_installments_years_to =
      editData?.number_of_installments_years_to || null;
    this.order = editData?.order || 0;
    this.featured_image = editData?.featured_image || null;
  }
}
