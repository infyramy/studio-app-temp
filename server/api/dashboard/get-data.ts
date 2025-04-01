import knex from "../../utils/knex";
import { addDays, subDays, startOfMonth, endOfMonth, format } from "date-fns";

export default defineEventHandler(async (event) => {
  try {
    // Get user info from auth middleware
    const { userId, username } = event.context.auth;
    console.log("Fetching dashboard data for user:", username);

    // Get all bookings with theme information
    const data = await knex("booking")
      .select("booking.*", "theme.title as theme")
      .leftJoin("theme", "booking.theme", "theme.id")
      .whereNot("booking.status", 4)
      .whereNot("booking.session_status", 3);

    // Get Total Bookings
    const totalBookings = data.length;

    // Calculate revenue statistics
    const revenue = data.reduce(
      (acc, booking) => {
        if (booking.status === 3) {
          // Full payment
          acc.fullPayment += booking.payment_amount || 0;
        } else if (booking.status === 2) {
          // Deposit
          acc.deposit += booking.payment_amount || 0;
        }
        return acc;
      },
      { fullPayment: 0, deposit: 0 }
    );

    // Get addon statistics
    const addonStats = new Map<number, { name: string; count: number }>();
    for (const booking of data) {
      if (booking.addon) {
        try {
          // Parse the JSON string into an array
          const addons =
            typeof booking.addon === "string"
              ? JSON.parse(booking.addon)
              : booking.addon;

          if (Array.isArray(addons)) {
            for (const addon of addons) {
              if (addon.id && addon.qty) {
                if (!addonStats.has(addon.id)) {
                  // Fetch addon name from database if not already in map
                  const addonInfo = await knex("addon")
                    .where("id", addon.id)
                    .first();
                  addonStats.set(addon.id, {
                    name: addonInfo?.title || "Unknown Addon",
                    count: addon.qty,
                  });
                } else {
                  const current = addonStats.get(addon.id)!;
                  addonStats.set(addon.id, {
                    ...current,
                    count: current.count + addon.qty,
                  });
                }
              }
            }
          }
        } catch (error) {
          console.error("Error parsing addon data:", error);
        }
      }
    }

    // Find top addon
    let topAddon = null;
    if (addonStats.size > 0) {
      const [highestCountAddon] = Array.from(addonStats.entries()).sort(
        ([, a], [, b]) => b.count - a.count
      );
      topAddon = {
        id: highestCountAddon[0],
        title: highestCountAddon[1].name,
        qty: highestCountAddon[1].count,
      };
    }
    // Get total pending sessions
    const totalPending = data.filter(
      (booking) => booking.session_status === 1
    ).length;

    // Calculate chart data
    const today = new Date();
    const thirtyDaysAgo = subDays(today, 30);
    const ninetyDaysAgo = subDays(today, 90);

    // Helper function to generate daily stats
    const getDailyStats = (startDate: Date, endDate: Date) => {
      const stats: Array<{
        date: string;
        bookings: number;
        unique_customers: number;
      }> = [];
      let currentDate = startDate;

      while (currentDate <= endDate) {
        const dateStr = format(currentDate, "yyyy-MM-dd");
        const dayBookings = data.filter(
          (booking) =>
            format(new Date(booking.created_date), "yyyy-MM-dd") === dateStr
        );

        stats.push({
          date: dateStr,
          bookings: dayBookings.length,
          unique_customers: new Set(dayBookings.map((b) => b.customer_id)).size,
        });

        currentDate = addDays(currentDate, 1);
      }
      return stats;
    };

    // Generate chart data
    const chartData = {
      thirtyDays: getDailyStats(thirtyDaysAgo, today),
      ninetyDays: getDailyStats(ninetyDaysAgo, today),
      yearly: Array.from({ length: 12 }, (_, i) => {
        const month = startOfMonth(new Date(today.getFullYear(), i));
        const monthEnd = endOfMonth(month);
        const monthBookings = data.filter((booking) => {
          const bookingDate = new Date(booking.created_date);
          return bookingDate >= month && bookingDate <= monthEnd;
        });

        return {
          month: format(month, "MMMM"),
          bookings: monthBookings.length,
          unique_customers: new Set(monthBookings.map((b) => b.customer_id))
            .size,
        };
      }),
    };

    // Get recent bookings (sorted by latest created_date)
    const recentBookings = [...data]
      .sort((a, b) => {
        const dateA = new Date(a.created_date).getTime();
        const dateB = new Date(b.created_date).getTime();
        return dateB - dateA;
      })
      .slice(0, 5)
      .map((booking) => ({
        id: booking.id,
        name: booking.user_fullname,
        theme: booking.theme,
        latest_booking: booking.created_date,
        payment_status: booking.status,
      }));

    // Get upcoming sessions (today + 6 more days = 7 days total)
    const sixDaysFromNow = addDays(today, 6);
    console.log(today);
    console.log(sixDaysFromNow);
    const upcomingSessions = await knex("booking")
      .select(
        "booking.id",
        "booking.user_fullname as name",
        "theme.title as theme",
        "booking.number_of_pax as pax",
        "booking.session_date as date",
        "booking.session_time as time",
        "booking.session_status as status"
      )
      .leftJoin("theme", "booking.theme", "theme.id")
      .where("booking.session_status", 1)
      .orderBy("booking.session_date", "asc")
      .limit(5);

    return {
      status: "success",
      data: {
        stats: {
          totalBookings,
          totalPending,
          addOns: Array.from(addonStats.values()),
          revenue,
        },
        chartData,
        recentBookings,
        upcomingSessions,
      },
    };
  } catch (error: any) {
    console.error("Dashboard data error:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to fetch dashboard data",
    });
  }
});
