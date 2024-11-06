import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const test = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      console.error("Failed to get user ID. User is not authenticated.");
      throw new Error("Unauthorized");
    }

    if (!args.email) {
      console.error("Email is required");
      throw new Error("Email is required");
    }
    const user = await ctx.db.get(userId);
    console.log(userId);
    return user;
  },
});

export const createBooking = mutation({
  args: {
    userId: v.optional(v.id("users")),
    movieId: v.id("movies"),
    showtimeId: v.id("showtimes"),
    email: v.string(),
    phone: v.string(),
    name: v.string(),
    selectedSeats: v.array(
      v.object({
        number: v.string(),
        status: v.string(),
        isBooked: v.boolean(),
        type: v.union(
          v.literal("empty"),
          v.literal("standard"),
          v.literal("vip"),
          v.literal("couple")
        ),
        centerType: v.optional(
          v.union(
            v.literal("first-left-row"),
            v.literal("first-right-row"),
            v.literal("first-row"),
            v.literal("middle-left-row"),
            v.literal("middle-row"),
            v.literal("middle-right-row"),
            v.literal("last-left-row"),
            v.literal("last-row"),
            v.literal("last-right-row"),
            v.literal("nomal")
          )
        ),
      })
    ),
    totalPrice: v.number(),
    paymentMethod: v.string(),
    paidAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = (await getAuthUserId(ctx)) || undefined;

    const {
      showtimeId,
      selectedSeats,
      totalPrice,
      paymentMethod,
      name,
      phone,
      email,
      movieId,
    } = args;

    const showtime = await ctx.db.get(showtimeId);
    if (!showtime) {
      throw new Error("Showtime not found");
    }

    showtime.seats.forEach((row) => {
      row.seats.forEach((item) => {
        const isHolding = selectedSeats.some(
          (selected) => selected.number === item.number
        );
        if (
          isHolding &&
          item.status !== "available" &&
          item.isBooked !== false
        ) {
          throw new Error(`Seat ${item.number} has already been booked.`);
        }
      });
    });
    const bookingId = await ctx.db.insert("bookings", {
      userId,
      movieId,
      email,
      phone,
      name,
      showtimeId,
      selectedSeats,
      totalPrice,
      status: "pending",
      paymentMethod,
    });

    return { bookingId };
  },
});

export const getBookingById = query({
  args: {
    bookingId: v.optional(v.id("bookings")),
  },
  handler: async (ctx, args) => {
    const { bookingId } = args;

    if (!bookingId) {
      return null;
    }

    const booking = await ctx.db.get(bookingId);

    if (!booking) {
      return null;
    }

    return booking;
  },
});

export const updateBookingPaid = mutation({
  args: {
    bookingId: v.id("bookings"),
  },
  handler: async (ctx, { bookingId }) => {
    // Lấy suất chiếu từ cơ sở dữ liệu
    const booking = await ctx.db.get(bookingId);
    if (!booking) {
      throw new Error("Showtime not found");
    }

    const updatedSeats = booking.selectedSeats.map((seat) => {
      return {
        ...seat,
        isBooked: true,
        status: "paid",
      };
    });

    await ctx.db.replace(bookingId, {
      ...booking,
      selectedSeats: updatedSeats,
      status: "paid",
      paidAt: Date.now(),
    });

    return { message: "paid successfully" };
  },
});

export const updateBookingCancel = mutation({
  args: {
    bookingId: v.id("bookings"),
  },
  handler: async (ctx, { bookingId }) => {
    // Lấy suất chiếu từ cơ sở dữ liệu
    const booking = await ctx.db.get(bookingId);
    if (!booking) {
      throw new Error("Showtime not found");
    }

    const updatedSeats = booking.selectedSeats.map((seat) => {
      return {
        ...seat,
        isBooked: false,
        status: "cancelled",
      };
    });

    await ctx.db.replace(bookingId, {
      ...booking,
      selectedSeats: updatedSeats,
      status: "cancelled",
      paidAt: Date.now(),
    });

    return { message: "cancelled successfully" };
  },
});

export const checkIsBooked = query({
  args: {
    movieId: v.id("movies"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      return false; // Trả về false nếu user không tồn tại
    }

    const existingBookings = await ctx.db
      .query("bookings")
      .filter((q) =>
        q.and(
          q.eq(q.field("userId"), args.userId),
          q.eq(q.field("movieId"), args.movieId)
        )
      )
      .collect(); // Sử dụng collect để lấy tất cả các booking

    // Kiểm tra xem có bất kỳ booking nào với trạng thái "paid"
    const isBooked = existingBookings.some(
      (booking) => booking.status === "paid"
    );

    return isBooked; // Trả về true nếu có booking "paid", ngược lại false
  },
});

export const getBookingByUserId = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const bookings = await ctx.db
      .query("bookings")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .order("desc")
      .collect();

    const bookingsWithMovies = await Promise.all(
      bookings.map(async (booking) => {
        const movie = await ctx.db.get(booking.movieId);

        const posterUrl = movie?.posterUrl
          ? await ctx.storage.getUrl(movie.posterUrl)
          : null;

        return {
          ...booking,
          movie: {
            ...movie,
            posterUrl,
          },
        };
      })
    );

    return bookingsWithMovies;
  },
});
