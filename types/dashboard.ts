export interface DashboardStats {
  totalBookings: number
  uniqueCustomers: number
  totalPending: number
  themeDistribution: Record<string, number>
  bookingsGrowth: number
  customersGrowth: number
}

export interface RecentBooking {
  id: string
  name: string
  latest_booking: string
  themes: string
  pending_bookings: number
}

export interface UpcomingSession {
  id: string
  name: string
  booking_date: string
  theme: string
  status: string
  location: string
}

export interface ChartDataPoint {
  date?: string
  month?: string
  bookings: number
  unique_customers: number
}

export interface DashboardData {
  stats: DashboardStats
  recentBookings: RecentBooking[]
  upcomingSessions: UpcomingSession[]
  chartData: {
    thirtyDays: ChartDataPoint[]
    ninetyDays: ChartDataPoint[]
    yearly: ChartDataPoint[]
  }
}

export interface PaxBasedPrice {
  id?: number;
  min_pax: number;
  max_pax: number;
  price: number;
}

export interface DateSpecificPrice {
  id?: number;
  theme_id?: number;
  start_date: string;
  end_date: string;
  amount: number;
  price_type: string;
  created_at?: string;
  updated_at?: string;
}

export interface Theme {
  id: number;
  title: string;
  description: string;
  price_type: 'fixed' | 'pax_based';
  price: number | null;
  pax_prices?: PaxBasedPrice[];
  deposit: number;
  image?: string;
  status: number;
  date_specific_prices?: DateSpecificPrice[];
} 