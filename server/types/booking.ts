export interface BookingReminder {
  payment_ref_number: string;
  phone_number: string;
  user_fullname: string;
  theme_title: string;
  number_of_pax: number;
  session_date: string;
  session_time: string;
  payment_total: number;
  payment_amount: number;
  referral_code?: string;
  user_phoneno: string;
  reminder: number;
  theme?: number;
  referral?: number;
  status: number;
}

export interface ConfigValues {
  company_name: string;
  admin_phoneno: string;
  waha_endpoint: string;
  waze_url: string;
  google_maps_url: string;
}

export interface ConfigRow {
  code: string;
  value: string;
} 