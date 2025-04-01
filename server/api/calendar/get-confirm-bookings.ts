import { whenever } from "@vueuse/core";
import db from "../../utils/knex";

interface Addon {
  id: number;
  qty?: number;
  price?: number;
}

interface AddonDetail {
  title: string | undefined;
  qty: number;
  price: number;
}

interface BookingRecord {
  addon: Addon[] | null;
  [key: string]: any;
}

interface DbAddon {
  id: number;
  title: string;
}

export default defineEventHandler(async (event) => {
  try {
    const bookings = await db("booking")
      .select(
        "booking.*",
        "theme.id as theme_id",
        "theme.title as theme_title",
        "theme.price as theme_price"
      )
      .leftJoin("theme", "theme.id", "booking.theme")
      .where((builder) => {
        builder.where("booking.status", 2).orWhere("booking.status", 3);
      });

    const result = await Promise.all(
      bookings.map(async (booking: BookingRecord) => {
        const addons: AddonDetail[] = [];

        let frame_quantity = 0;

        // Parse the JSON string into an array
        const addons_ =
          typeof booking.addon === "string"
            ? JSON.parse(booking.addon)
            : booking.addon;

        console.log("Booking referral:", booking.referral);

        // Get referral detail
        const referral = await db("referral")
          .where("id", booking.referral)
          .first();
        console.log("Referral:", referral);
          

        if (addons_ && Array.isArray(addons_)) {
          for (const addonId of addons_) {
            const id = typeof addonId === "object" ? addonId.id : addonId;
            const addonDetail = (await db("addon").where("id", id).first()) as
              | DbAddon
              | undefined;

            addons.push({
              title: addonDetail?.title,
              qty: typeof addonId === "object" ? addonId.qty ?? 1 : 1,
              price: addonId?.price ?? 0,
            });

            frame_quantity += addons[addons.length - 1].qty;
          }
        }

        return {
          ...booking,
          addons,
          frame_quantity,
          referral_code: referral?.referral,
        };
      })
    );

    return result;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch bookings",
    });
  }
});
