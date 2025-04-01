import nodemailer from 'nodemailer';
import { createTransport } from 'nodemailer';

interface ReceiptData {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  theme: string;
  sessionDate: string;
  sessionTime: string;
  status: number;
  createdDate: string;
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event) as ReceiptData;

    // Create email transporter
    const transporter = createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    // Generate receipt HTML
    const receiptHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .receipt-box { border: 1px solid #ddd; padding: 20px; border-radius: 8px; }
            .section { margin-bottom: 20px; }
            .section-title { font-weight: bold; margin-bottom: 10px; color: #3C2A21; }
            .detail-row { display: flex; justify-content: space-between; margin-bottom: 5px; }
            .label { color: #666; }
            .value { font-weight: 500; }
            .footer { text-align: center; margin-top: 30px; font-size: 0.9em; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Booking Receipt</h2>
              <p>Thank you for choosing our services!</p>
            </div>
            
            <div class="receipt-box">
              <div class="section">
                <div class="section-title">Booking Information</div>
                <div class="detail-row">
                  <span class="label">Booking ID:</span>
                  <span class="value">#${body.id}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Status:</span>
                  <span class="value">${
                    body.status === 1 ? "Paid" :
                    body.status === 2 ? "Pending" :
                    body.status === 3 ? "Cancelled" :
                    body.status === 4 ? "Completed" : "Unknown"
                  }</span>
                </div>
                <div class="detail-row">
                  <span class="label">Created Date:</span>
                  <span class="value">${body.createdDate}</span>
                </div>
              </div>

              <div class="section">
                <div class="section-title">Customer Details</div>
                <div class="detail-row">
                  <span class="label">Name:</span>
                  <span class="value">${body.customerName}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Email:</span>
                  <span class="value">${body.email}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Phone:</span>
                  <span class="value">${body.phone}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Address:</span>
                  <span class="value">${body.address}</span>
                </div>
              </div>

              <div class="section">
                <div class="section-title">Session Details</div>
                <div class="detail-row">
                  <span class="label">Theme:</span>
                  <span class="value">${body.theme}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Date:</span>
                  <span class="value">${body.sessionDate}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Time:</span>
                  <span class="value">${body.sessionTime}</span>
                </div>
              </div>
            </div>

            <div class="footer">
              <p>This is an automatically generated receipt. Please keep it for your records.</p>
              <p>If you have any questions, please contact us.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: body.email,
      subject: `Booking Receipt #${body.id}`,
      html: receiptHtml
    });

    return {
      success: true,
      message: 'Receipt sent successfully'
    };
  } catch (error) {
    console.error('Error sending receipt:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to send receipt'
    });
  }
}); 