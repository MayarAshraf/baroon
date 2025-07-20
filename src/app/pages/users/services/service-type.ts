export interface User {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone: string;
  email_verified: boolean;
  role: string | null;
  role_id: number;
  role_slug: string;
  created_at: string;
}
export class UserModel {
  id?: number | null;
  first_name: string | null;
  last_name: string | null;
  username: string | null;
  email: string | null;
  phone: string | null;
  password: string | null;
  password_confirmation: string | null;
  role_id: number | null;
  constructor(editData?: UserModel) {
    this.id = editData?.id || null;
    this.first_name = editData?.first_name || null;
    this.last_name = editData?.last_name || null;
    this.username = editData?.username || null;
    this.email = editData?.email || null;
    this.phone = editData?.phone || null;
    this.password = editData?.password || null;
    this.password_confirmation = editData?.password_confirmation || null;
    this.role_id = editData?.role_id || null;
  }
}
