import { NextRequest, NextResponse } from "next/server";
import { fetchQuery, fetchMutation } from "convex/nextjs";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";

export async function GET(req: NextRequest) {
  try {
    const vnpayParams = Object.fromEntries(req.nextUrl.searchParams);
    console.log("Received Parameters:", vnpayParams);

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
