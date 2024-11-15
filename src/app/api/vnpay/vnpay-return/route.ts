import { NextRequest, NextResponse } from "next/server";
import { fetchQuery, fetchMutation } from "convex/nextjs";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";

import nodemailer from "nodemailer";



export async function GET(req: NextRequest) {
  try {
    const vnpayParams = Object.fromEntries(req.nextUrl.searchParams);
    console.log("Received Parameters:", vnpayParams);
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    const bookingId = vnpayParams.vnp_OrderInfo as Id<"bookings">;
    const responseCode = vnpayParams.vnp_ResponseCode;

    if (!bookingId) {
      console.error("Booking ID is missing");
      return NextResponse.redirect(
        `${req.nextUrl.origin}/failure?message=BookingIdMissing`
      );
    }

    const booking = await fetchQuery(api.bookings.getBookingById, {
      bookingId,
    });

    if (!booking) {
      console.log("No booking found");
      return NextResponse.redirect(
        `${req.nextUrl.origin}/failure?message=NoBookingFound`
      );
    }

    const showtimeId = booking.showtimeId;
    const selectedSeats = booking.selectedSeats;
    const seatDetails = selectedSeats
      .map((seat) => `Ghế ${seat.number} (${seat.type})`)
      .join(", ");
    const totalPrice = booking.totalPrice;

    if (responseCode === "00") {
      const updateSeats = await fetchMutation(
        api.showtimes.updateShowtimeStatus,
        { showtimeId, selectedSeats }
      );

      if (!updateSeats) {
        console.log("Update status failed");
        return NextResponse.redirect(
          `${req.nextUrl.origin}/failure?message=UpdateStatusFailed`
        );
      }

      const updateBooking = await fetchMutation(
        api.bookings.updateBookingPaid,
        { bookingId }
      );

      if (!updateBooking) {
        console.log("Update booking failed");
        return NextResponse.redirect(
          `${req.nextUrl.origin}/failure?message=UpdateBookingFailed`
        );
      }

      const mailOptions = {
        from: process.env.SMTP_USER,
        to: booking.email,
        subject: "Xác nhận đặt vé thành công",
        text: `Chào bạn, 
        Đặt vé của bạn đã thành công. Mã đặt vé: ${bookingId}. 
        Chi tiết: Ghế đã chọn: ${seatDetails}, 
        Id Suất chiếu: ${showtimeId}. 
        Tổng tiền: ${totalPrice.toLocaleString("vi-VN")} đ. 
        Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.`,
      };

      await transporter.sendMail(mailOptions);

      return NextResponse.redirect(
        `${req.nextUrl.origin}/success?responseCode=${responseCode}`
      );
    } else {
      await fetchMutation(api.bookings.updateBookingCancel, { bookingId });
      await fetchMutation(api.showtimes.updateShowtimeCancel, {
        showtimeId,
        selectedSeats,
      });

      return NextResponse.redirect(
        `${req.nextUrl.origin}/failure?responseCode=${responseCode}`
      );
    }
  } catch (error) {
    console.error("Error in processing vnpay return:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
