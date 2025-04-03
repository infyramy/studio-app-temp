## SpecStory

## Payment Gateway Issues and Notifications (4/3/2025, 4:26:05 PM)

_**User**_

okay now the booking form can conitnue to payment gateway. please stay this way, dont change too much code and rembeber currently payment gateway is can be accessed.

but theres a few problem i saw in the log, 
1. payment success, but cannot change the status via api to the db 401 unauthorized error. 
2. whatsapp not sending any notification after success (maybe related to not changing the status in db)



---

_**Assistant**_



---

_****_

Let me look into these issues. First, I'll examine the payment success handling and the authorization mechanisms for status updates.

---

_****_

<details>
            <summary>Searched codebase "payment success status update 401 unauthorized" • **25** results</summary>
        
| File | Lines |
|------|-------|
| `server/api/booking/update-payment-failed.ts` | L1-50 |
| `.specstory/history/2025-04-01_14-13-dynamic-title-configuration-in-nuxt-js.md` | L3131-3203 |
| `.specstory/history/2025-04-01_14-13-dynamic-title-configuration-in-nuxt-js.md` | L3425-3492 |
| `.specstory/history/2025-04-03_02-21-reverting-to-previous-git-commits.md` | L11385-11455 |
| `server/api/booking/update-status.ts` | L7-85 |
| `server/api/booking/check-payment-status.ts` | L186-246 |
| `server/api/booking/payment-callback.ts` | L331-363 |
| `server/api/booking/update-payment-status.ts` | L67-126 |
| `.specstory/history/2025-04-03_02-21-reverting-to-previous-git-commits.md` | L12694-12760 |
| `.specstory/history/2025-04-03_02-21-reverting-to-previous-git-commits.md` | L7433-7475 |
| `.specstory/history/2025-04-03_02-21-reverting-to-previous-git-commits.md` | L9587-9660 |
| `.specstory/history/2025-04-03_02-21-reverting-to-previous-git-commits.md` | L12760-12832 |
| `pages/book-a-session/receipt.vue` | L866-921 |
| `.specstory/history/2025-04-03_02-21-reverting-to-previous-git-commits.md` | L798-865 |
| `server/api/booking/payment-callback.ts` | L280-331 |
| `.specstory/history/2025-04-03_02-21-reverting-to-previous-git-commits.md` | L434-516 |
| `server/api/setting/update-payment-config.ts` | L17-96 |
| `.specstory/history/2025-04-03_02-21-reverting-to-previous-git-commits.md` | L10497-10542 |
| `.specstory/history/2025-04-03_02-21-reverting-to-previous-git-commits.md` | L3026-3101 |
| `.specstory/history/2025-04-03_02-21-reverting-to-previous-git-commits.md` | L9955-10064 |
| `server/api/booking/update-payment-status.ts` | L126-133 |
| `server/api/booking/update-payment-status.ts` | L39-67 |
| `server/api/booking/create-payment.ts` | L63-117 |
| `.specstory/history/2025-04-03_02-21-reverting-to-previous-git-commits.md` | L9660-9713 |
| `server/api/booking/check-payment-status.ts` | L120-186 |

</details>

---

_****_

Now, let me examine the WhatsApp notification functionality and check for any authentication related code:

---

_****_

<details>
            <summary>Searched codebase "whatsapp notification sending function after payment success" • **25** results</summary>
        
| File | Lines |
|------|-------|
| `server/utils/whatsapp.ts` | L152-190 |
| `.specstory/history/2025-04-03_02-21-reverting-to-previous-git-commits.md` | L12760-12832 |
| `server/utils/whatsapp.ts` | L190-232 |
| `.specstory/history/2025-04-03_11-42-exploring-whatsapp-notification-code.md` | L2301-2380 |
| `server/api/booking/payment-callback.ts` | L206-234 |
| `server/api/booking/payment-callback.ts` | L160-206 |
| `.specstory/history/2025-04-03_02-21-reverting-to-previous-git-commits.md` | L13180-13239 |
| `.specstory/history/2025-04-03_02-21-reverting-to-previous-git-commits.md` | L12976-13180 |
| `server/api/booking/payment-callback.ts` | L99-160 |
| `server/api/booking/payment-callback.ts` | L280-331 |
| `server/api/booking/proceed.ts` | L714-761 |
| `.specstory/history/2025-04-03_02-21-reverting-to-previous-git-commits.md` | L798-865 |
| `.specstory/history/2025-04-03_02-21-reverting-to-previous-git-commits.md` | L7517-7576 |
| `.specstory/history/2025-04-03_11-42-exploring-whatsapp-notification-code.md` | L828-866 |
| `.specstory/history/2025-04-03_11-42-exploring-whatsapp-notification-code.md` | L690-759 |
| `server/utils/whatsapp.ts` | L232-283 |
| `.specstory/history/2025-04-03_11-42-exploring-whatsapp-notification-code.md` | L2380-2428 |
| `server/utils/whatsapp.ts` | L283-309 |
| `server/api/booking/proceed.ts` | L653-714 |
| `.specstory/history/2025-04-01_14-13-dynamic-title-configuration-in-nuxt-js.md` | L4374-4430 |
| `server/api/booking/proceed.ts` | L761-789 |
| `.specstory/history/2025-04-03_02-21-reverting-to-previous-git-commits.md` | L7576-7654 |
| `.specstory/history/2025-04-01_14-13-dynamic-title-configuration-in-nuxt-js.md` | L3811-3873 |
| `.specstory/history/2025-04-03_11-42-exploring-whatsapp-notification-code.md` | L1679-1745 |
| `server/utils/whatsapp.ts` | L126-152 |

</details>

---

_****_

Let me check for any authentication-related code and let's look at what happens in the client-side after payment success:

---

_****_

<details>
            <summary>Searched codebase "update booking status after payment client-side" • **25** results</summary>
        
| File | Lines |
|------|-------|
| `server/api/booking/update-payment-status.ts` | L39-67 |
| `server/api/booking/update-payment-status.ts` | L67-126 |
| `server/api/booking/update-payment-failed.ts` | L1-50 |
| `server/api/booking/update-status.ts` | L7-85 |
| `server/api/booking/update-payment-status.ts` | L1-39 |
| `server/api/booking/payment-callback.ts` | L280-331 |
| `server/api/booking/payment-callback.ts` | L331-363 |
| `pages/dashboard/bookings.vue` | L510-531 |
| `server/api/booking/check-payment-status.ts` | L186-246 |
| `.specstory/history/2025-04-03_02-21-reverting-to-previous-git-commits.md` | L12694-12760 |
| `.specstory/history/2025-04-01_14-13-dynamic-title-configuration-in-nuxt-js.md` | L3131-3203 |
| `pages/dashboard/bookings.vue` | L1227-1260 |
| `server/cron/booking-reminder.ts` | L217-223 |
| `.specstory/history/2025-04-03_02-21-reverting-to-previous-git-commits.md` | L12760-12832 |
| `.specstory/history/2025-04-03_02-21-reverting-to-previous-git-commits.md` | L11385-11455 |
| `.specstory/history/2025-04-03_02-21-reverting-to-previous-git-commits.md` | L798-865 |
| `pages/book-a-session/receipt.vue` | L999-1049 |
| `.specstory/history/2025-04-03_02-21-reverting-to-previous-git-commits.md` | L9587-9660 |
| `server/api/booking/payment-callback.ts` | L234-280 |
| `server/api/booking/update-session-status.ts` | L1-45 |
| `.specstory/history/2025-04-01_14-13-dynamic-title-configuration-in-nuxt-js.md` | L3425-3492 |
| `pages/book-a-session/receipt.vue` | L866-921 |
| `server/api/booking/update-payment-status.ts` | L126-133 |
| `.specstory/history/2025-04-03_02-21-reverting-to-previous-git-commits.md` | L359-434 |
| `.specstory/history/2025-04-03_02-21-reverting-to-previous-git-commits.md` | L7433-7475 |

</details>

---

_****_

Let me look at the client-side code that handles updating the booking status after payment:

---

_****_

<details>
            <summary>Searched codebase "updateBookingStatus client-side payment receipt page" • **25** results</summary>
        
| File | Lines |
|------|-------|
| `server/api/booking/update-payment-failed.ts` | L1-50 |
| `server/api/booking/update-status.ts` | L7-85 |
| `pages/book-a-session/receipt.vue` | L999-1049 |
| `.specstory/history/2025-04-03_02-21-reverting-to-previous-git-commits.md` | L9587-9660 |
| `pages/book-a-session/receipt.vue` | L1087-1151 |
| `server/api/booking/send-receipt.ts` | L66-123 |
| `pages/book-a-session/receipt.vue` | L1299-1377 |
| `pages/book-a-session/receipt.vue` | L866-921 |
| `.specstory/history/2025-04-03_02-21-reverting-to-previous-git-commits.md` | L11385-11455 |
| `server/api/booking/update-payment-status.ts` | L39-67 |
| `pages/book-a-session/receipt.vue` | L198-237 |
| `server/api/booking/update-status.ts` | L1-7 |
| `server/api/booking/update-payment-status.ts` | L1-39 |
| `pages/book-a-session/receipt.vue` | L1049-1087 |
| `server/api/booking/update-payment-status.ts` | L67-126 |
| `pages/dashboard/bookings.vue` | L1227-1260 |
| `pages/dashboard/bookings.vue` | L510-531 |
| `pages/dashboard/bookings.vue` | L1983-2030 |
| `pages/book-a-session/failed-payment.vue` | L229-298 |
| `pages/book-a-session/receipt-qr/index.vue` | L131-175 |
| `server/api/booking/payment-callback.ts` | L280-331 |
| `pages/book-a-session/receipt.vue` | L680-755 |
| `pages/book-a-session/receipt.vue` | L1227-1299 |
| `server/api/booking/proceed.ts` | L558-618 |
| `pages/book-a-session/receipt.vue` | L648-680 |

</details>

---

_****_

Let me check for any authentication mechanisms in the API endpoints:

---

_****_

<details>
            <summary>Searched codebase "authentication middleware 401 unauthorized" • **25** results</summary>
        
| File | Lines |
|------|-------|
| `server/middleware/auth.ts` | L48-109 |
| `plugins/api.ts` | L36-68 |
| `server/middleware/auth.ts` | L1-48 |
| `server/api/auth/me.ts` | L1-67 |
| `server/api/auth/verify.ts` | L11-75 |
| `server/middleware/auth.ts` | L109-117 |
| `middleware/auth.ts` | L1-41 |
| `server/api/auth/me.ts` | L67-95 |
| `server/api/auth/login.ts` | L48-119 |
| `stores/auth.js` | L1-34 |
| `server/api/auth/refresh.ts` | L12-93 |
| `server/api/auth/verify.ts` | L1-11 |
| `plugins/api.ts` | L1-36 |
| `stores/auth.js` | L110-160 |
| `server/api/auth/refresh.ts` | L1-12 |
| `server/api/auth/google.ts` | L1-40 |
| `server/api/auth/login.ts` | L1-48 |
| `server/api/auth/refresh.ts` | L93-100 |
| `server/api/auth/login.ts` | L119-138 |
| `plugins/auth.ts` | L1-41 |
| `server/api/auth/google/status.ts` | L1-41 |
| `pages/login.vue` | L1-64 |
| `.specstory/history/2025-04-03_02-21-reverting-to-previous-git-commits.md` | L8330-8410 |
| `server/api/auth/google/init.ts` | L1-28 |
| `server/api/booking/proceed.ts` | L195-255 |

</details>

---

_****_

Now, let's look at the client-side code that is making the status update request:

---

_****_

Read file: undefined

---

_****_

Let's check the `update-status` API endpoint:

---

_****_

Read file: undefined

---

_****_

Let's check the authentication middleware configuration:

---

_****_

Read file: undefined

---

_****_

Based on my analysis of the code, I can identify what's causing the issues:

1. The 401 unauthorized error when updating the booking status is occurring because `/api/booking/update-status` is not in the PUBLIC_ROUTES list in the auth middleware.

2. The WhatsApp notifications aren't being sent because they depend on the status update being successful, which is failing due to the authorization error.

Here's a simple solution that should fix both issues without requiring extensive code changes:

---

_****_

```diff
    "/api/setting/get-organization",
    "/api/booking/update-payment-failed",
+   "/api/booking/update-status",
+   "/api/booking/check-payment-status",
    "/api/setting/get-holidays",
  ];
```

---

_****_

Let's now enable console logging for better debugging in the `update-status.ts` file:

---

_****_

```diff
    try {
      const { receiptNumber, status } = getQuery(event);
- 
+     
+     console.log("Update status request:", { receiptNumber, status });
+ 
      if (!receiptNumber || !status) {
+       console.log("Missing parameters:", { receiptNumber, status });
        throw createError({
          statusCode: 400,
  
      // Get the booking
+     console.log("Looking up booking with receipt number:", receiptNumber);
      const booking = await knex("booking")
        .where("payment_ref_number", receiptNumber)
        .first();
  
      if (!booking) {
+       console.log("Booking not found for receipt number:", receiptNumber);
        throw createError({
          statusCode: 404,
          message: "Booking not found",
        });
      }
+ 
+     console.log("Booking found:", { 
+       id: booking.id, 
+       status: booking.status, 
+       payment_type: booking.payment_type 
+     });
  
      // Skip if booking is already successful (status 2 or 3)
      if (booking.status === 2 || booking.status === 3) {
+       console.log("Booking already successful, skipping update");
        return {
          statusCode: 200,
          paymentStatus = 1; // Pending
      }
+ 
+     console.log("Mapped status:", { clientStatus: status, dbStatus: paymentStatus });
  
      // Update booking status
+     console.log("Updating booking status to:", paymentStatus);
      await knex("booking").where("payment_ref_number", receiptNumber).update({
        payment_date: new Date(),
  
      // Log status transition
+     console.log("Logging status transition in booking_status_log");
      await knex("booking_status_log").insert({
        booking_id: booking.id,
      });
  
+     console.log("Status update completed successfully");
      return {
        statusCode: 200,
```

---

_****_



---



---

