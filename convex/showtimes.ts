import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { addDays, isSameDay, parseISO, isAfter } from "date-fns";
import { Id } from "./_generated/dataModel";
export const create = mutation({
  args: {
    movieId: v.id("movies"),
    cinemaCompanyId: v.optional(v.id("cinemaCompanies")),
    branchId: v.optional(v.id("branches")),
    screeningRoomId: v.id("screeningRooms"),
    showDate: v.string(),
    startTime: v.string(),
    endTime: v.string(),
    ticketPrices: v.array(
      v.object({
        seatType: v.union(
          v.literal("standard"),
          v.literal("vip"),
          v.literal("couple")
        ),
        price: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const {
      movieId,
      cinemaCompanyId,
      screeningRoomId,
      showDate,
      startTime,
      endTime,
      ticketPrices,
      branchId,
    } = args;
    const newStartTime = parseISO(startTime);
    let newEndTime = parseISO(endTime);

    // Kiểm tra định dạng thời gian
    if (isNaN(newStartTime.getTime()) || isNaN(newEndTime.getTime())) {
      throw new Error(
        "Invalid startTime or endTime format. Please use ISO 8601 format."
      );
    }

    if (newStartTime.getTime() > newEndTime.getTime()) {
      const isSameDate = isSameDay(newStartTime, newEndTime);
      console.log("newStartTime:", newStartTime.toISOString());
      console.log("newEndTime:", newEndTime.toISOString());
      console.log("isSameDate", isSameDate);

      if (isSameDate) {
        throw new Error("End time phải lớn hơn start time");
      } else {
        newEndTime = addDays(newEndTime, 1);
      }
    }
    console.log("newStartTime:", newStartTime.toISOString());
    console.log("newEndTime:", newEndTime.toISOString());
    // Buffer thời gian giữa các suất chiếu (5 phút)
    const bufferTime = 5 * 60 * 1000;

    // Truy vấn các suất chiếu trong cùng phòng chiếu vào cùng ngày
    const existingShowtimes = await ctx.db
      .query("showtimes")
      .filter((q) =>
        q.and(
          q.eq(q.field("screeningRoomId"), screeningRoomId.toString()),
          q.eq(q.field("showDate"), showDate)
        )
      )
      .collect();

    console.log("Existing Showtimes:", existingShowtimes);
    let suggestedStartTime = null;

    // Vòng lặp qua các suất chiếu hiện có để kiểm tra trùng lặp thời gian
    for (const showtime of existingShowtimes) {
      console.log("Checking showtime:", showtime);
      const existingStartTime = parseISO(showtime.startTime);
      let existingEndTime = parseISO(showtime.endTime);
      // Kiểm tra nếu suất chiếu hiện tại cũng có thời gian qua ngày
      // Kiểm tra nếu suất chiếu hiện tại cũng có thời gian qua ngày
      if (existingEndTime <= existingStartTime) {
        existingEndTime = addDays(existingEndTime, 1);
        console.log(
          "Adjusted existingEndTime to next day:",
          existingEndTime.toISOString()
        );
      }
      const existingEndWithBuffer = new Date(
        existingEndTime.getTime() + bufferTime
      );

      console.log({
        newStartTime: newStartTime.toISOString(),
        newEndTime: newEndTime.toISOString(),
        existingStartTime: existingStartTime.toISOString(),
        existingEndTime: existingEndTime.toISOString(),
        existingEndWithBuffer: existingEndWithBuffer.toISOString(),
      });

      // Kiểm tra trùng lặp thời gian
      const isOverlapping =
        (newStartTime.getTime() >= existingStartTime.getTime() &&
          newStartTime.getTime() < existingEndWithBuffer.getTime()) ||
        (newEndTime.getTime() > existingStartTime.getTime() &&
          newEndTime.getTime() <= existingEndTime.getTime()) ||
        (newStartTime.getTime() <= existingStartTime.getTime() &&
          newEndTime.getTime() >= existingEndTime.getTime());

      if (isOverlapping) {
        suggestedStartTime = existingEndWithBuffer;
        console.log(
          "Thời gian trùng lặp, đề xuất startTime:",
          suggestedStartTime
        );
        break;
      }
    }

    if (suggestedStartTime) {
      throw new Error(
        `Suất chiếu bị trùng hoặc không đủ thời gian dọn dẹp giữa các suất chiếu trong phòng ${screeningRoomId} vào ngày ${showDate}. ` +
          `Suất chiếu hợp lệ tiếp theo có thể bắt đầu vào: ${suggestedStartTime.toLocaleTimeString()}.`
      );
    }

    // Truy vấn danh sách hàng ghế
    const rows = await ctx.db
      .query("rows")
      .withIndex("by_screeningRoom_and_rowNumber", (q) =>
        q.eq("screeningRoomId", screeningRoomId)
      )
      .collect();

    if (rows.length === 0) {
      throw new Error(
        `Không tìm thấy hàng ghế nào cho phòng chiếu có id ${screeningRoomId}`
      );
    }

    // Xử lý từng hàng ghế và ghế ngồi
    const seats = await Promise.all(
      rows.map(async (row) => {
        const seatsInRow = await ctx.db
          .query("seats")
          .withIndex("by_rowId_and_number", (q) => q.eq("rowId", row._id))
          .collect();

        const sortedSeats = seatsInRow?.sort((a, b) => {
          return a._creationTime - b._creationTime;
        });

        return {
          rowNumber: row.rowNumber,
          seats: sortedSeats.map((seat) => ({
            number: seat.number,
            type: seat.type,
            centerType: seat.centerType || "nomal",
            isBooked: false,
            status: "available",
          })),
        };
      })
    );

    // Tạo suất chiếu mới
    const newShowtime = await ctx.db.insert("showtimes", {
      movieId,
      cinemaCompanyId,
      branchId,
      screeningRoomId,
      showDate,
      startTime: newStartTime.toISOString(), // Đảm bảo lưu đúng định dạng ISO
      endTime: newEndTime.toISOString(), // Đảm bảo lưu đúng định dạng ISO
      ticketPrices,
      seats, // Thêm mảng ghế đã cấu trúc
    });

    // Trả về thông tin suất chiếu mới
    return newShowtime;
  },
});

export const getShowtimesByDate = query({
  args: {
    showDate: v.optional(v.string()),
    movieId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { showDate, movieId } = args;
    if (!showDate || !movieId) {
      return [];
    }
    const now = new Date();
    const vietnamTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);
    const showtimes = await ctx.db
      .query("showtimes")
      .filter((q) =>
        q.and(
          q.eq(q.field("showDate"), showDate),
          q.eq(q.field("movieId"), movieId),
          q.gt(q.field("startTime"), vietnamTime.toISOString())
        )
      )
      .collect();

    // Nếu không có suất chiếu nào vào ngày này
    if (showtimes.length === 0) {
      // throw new Error(`Không tìm thấy suất chiếu nào vào ngày ${showDate}`);
      return [];
    }
    const showtimesWithLogoUrlsCompanies = await Promise.all(
      showtimes.map(async (showtime) => {
        const companyId = showtime.cinemaCompanyId as Id<"cinemaCompanies">;
        const company = await ctx.db.get(companyId);
        const branchId = showtime.branchId as Id<"branches">;
        const branch = await ctx.db.get(branchId);

        const branchName = branch?.name;
        const branchAddress = branch?.address;

        const logoUrlString = company?.logoUrl
          ? await ctx.storage.getUrl(company.logoUrl)
          : undefined;
        return {
          ...showtime,
          branchName,
          branchAddress,
          logoUrl: logoUrlString,
        };
      })
    );

    // Trả về danh sách các suất chiếu
    return showtimesWithLogoUrlsCompanies;
  },
});

export const getShowtimesByCinemaCompanyAndDate = query({
  args: {
    cinemaCompanyId: v.optional(v.string()),
    showDate: v.optional(v.string()),
    movieId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { cinemaCompanyId, showDate, movieId } = args;
    if (!cinemaCompanyId || !showDate || !movieId) {
      return [];
    }
    const now = new Date();
    const vietnamTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);
    const showtimes = await ctx.db
      .query("showtimes")
      .filter((q) =>
        q.and(
          q.eq(q.field("cinemaCompanyId"), cinemaCompanyId),
          q.eq(q.field("showDate"), showDate),
          q.eq(q.field("movieId"), movieId),
          q.gt(q.field("startTime"), vietnamTime.toISOString())
        )
      )
      .collect();

    if (showtimes.length === 0) {
      // throw new Error(
      //   `Không tìm thấy suất chiếu nào cho công ty rạp chiếu ${cinemaCompanyId} vào ngày ${showDate}`
      // );
      return [];
    }
    const showtimesWithLogoUrlsCompanies = await Promise.all(
      showtimes.map(async (showtime) => {
        const companyId = showtime.cinemaCompanyId as Id<"cinemaCompanies">;
        const company = await ctx.db.get(companyId);
        const branchId = showtime.branchId as Id<"branches">;
        const branch = await ctx.db.get(branchId);

        const branchName = branch?.name;
        const branchAddress = branch?.address;

        const logoUrlString = company?.logoUrl
          ? await ctx.storage.getUrl(company.logoUrl)
          : undefined;
        return {
          ...showtime,
          branchName,
          branchAddress,
          logoUrl: logoUrlString,
        };
      })
    );

    return showtimesWithLogoUrlsCompanies;
  },
});

export const getShowtimesByBranchAndDate = query({
  args: {
    branchId: v.optional(v.id("branches")),
    showDate: v.optional(v.string()),
    movieId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { branchId, showDate, movieId } = args;
    if (!branchId || !showDate || !movieId) {
      return [];
    }
    const now = new Date();
    const vietnamTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);
    const showtimes = await ctx.db
      .query("showtimes")
      .filter((q) =>
        q.and(
          q.eq(q.field("branchId"), branchId),
          q.eq(q.field("movieId"), movieId),
          q.eq(q.field("showDate"), showDate),
          q.gt(q.field("startTime"), vietnamTime.toISOString())
        )
      )
      .collect();

    if (showtimes.length === 0) {
      // throw new Error(
      //   `Không tìm thấy suất chiếu nào cho công ty rạp chiếu ${cinemaCompanyId} vào ngày ${showDate}`
      // );
      return [];
    }
    const showtimesWithLogoUrlsCompanies = await Promise.all(
      showtimes.map(async (showtime) => {
        const companyId = showtime.cinemaCompanyId as Id<"cinemaCompanies">;
        const company = await ctx.db.get(companyId);
        const branchId = showtime.branchId as Id<"branches">;
        const branch = await ctx.db.get(branchId);
        const movieId = showtime.movieId as Id<"movies">;
        const movie = await ctx.db.get(movieId);
        const screeningRoomId =
          showtime.screeningRoomId as Id<"screeningRooms">;
        const room = await ctx.db.get(screeningRoomId);
        const screeningRoomName = room?.name;
        const movieName = movie?.title;
        const branchName = branch?.name;
        const branchAddress = branch?.address;

        const logoUrlString = company?.logoUrl
          ? await ctx.storage.getUrl(company.logoUrl)
          : undefined;
        return {
          ...showtime,
          branchName,
          branchAddress,
          screeningRoomName,
          movieName,
          logoUrl: logoUrlString,
        };
      })
    );

    return showtimesWithLogoUrlsCompanies;
  },
});

export const getShowtimeById = query({
  args: {
    showtimeId: v.optional(v.id("showtimes")),
  },
  handler: async (ctx, args) => {
    const { showtimeId } = args;

    // Kiểm tra xem showtimeId có tồn tại không
    if (!showtimeId) {
      return null; // Nếu không có showtimeId, trả về null
    }

    // Lấy thông tin suất chiếu theo showtimeId
    const showtime = await ctx.db.get(showtimeId);

    // Nếu không tìm thấy suất chiếu, trả về null
    if (!showtime) {
      return null;
    }

    // Lấy thêm các thông tin liên quan từ các bảng khác (cinemaCompany, branch, movie, screeningRoom)
    const companyId = showtime.cinemaCompanyId as Id<"cinemaCompanies">;
    const company = await ctx.db.get(companyId);

    const branchId = showtime.branchId as Id<"branches">;
    const branch = await ctx.db.get(branchId);

    const movieId = showtime.movieId as Id<"movies">;
    const movie = await ctx.db.get(movieId);

    const screeningRoomId = showtime.screeningRoomId as Id<"screeningRooms">;
    const room = await ctx.db.get(screeningRoomId);

    // Lấy tên phòng chiếu, tên phim, tên rạp, và địa chỉ rạp
    const screeningRoomName = room?.name;
    const movieName = movie?.title;
    const branchName = branch?.name;
    const branchAddress = branch?.address;

    // Lấy logoUrl của công ty rạp nếu có
    const logoUrlString = company?.logoUrl
      ? await ctx.storage.getUrl(company.logoUrl)
      : undefined;

    // Trả về đối tượng showtime kèm theo các thông tin bổ sung
    return {
      ...showtime,
      branchName,
      branchAddress,
      screeningRoomName,
      movieName,
      logoUrl: logoUrlString,
    };
  },
});

export const updateSeats = mutation({
  args: {
    showtimeId: v.id("showtimes"),
    selectedSeats: v.array(
      v.object({
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
        number: v.string(),
        type: v.union(
          v.literal("standard"),
          v.literal("vip"),
          v.literal("couple")
        ),
        isBooked: v.boolean(),
        status: v.string(),
      })
    ),
  },
  handler: async (ctx, { showtimeId, selectedSeats }) => {
    // Lấy suất chiếu từ cơ sở dữ liệu
    const showtime = await ctx.db.get(showtimeId);
    if (!showtime) {
      throw new Error("Showtime not found");
    }
    const updatedSeats = showtime.seats.map((row) => {
      // Cập nhật hàng ghế
      return {
        ...row,
        seats: row.seats.map((item) => {
          // Kiểm tra ghế có trong danh sách ghế đã chọn không
          const isBooked = selectedSeats.some(
            (selected) => selected.number === item.number
          );
          return {
            ...item,
            isBooked: isBooked ? true : item.isBooked, // Đánh dấu ghế đã đặt nếu có
            status: isBooked ? "booked" : item.status,
          };
        }),
      };
    });

    await ctx.db.replace(showtimeId, { ...showtime, seats: updatedSeats });

    return { message: "Seats updated successfully" };
  },
});

export const holdSeats = mutation({
  args: {
    showtimeId: v.id("showtimes"),
    selectedSeats: v.array(
      v.object({
        number: v.string(),
        type: v.union(
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
            v.literal("normal")
          )
        ),
      })
    ),
    userId: v.string(), // Thêm ID người dùng vào args
  },
  handler: async (ctx, { showtimeId, selectedSeats, userId }) => {
    // Lấy suất chiếu từ cơ sở dữ liệu
    const showtime = await ctx.db.get(showtimeId);
    if (!showtime) {
      throw new Error("Showtime not found");
    }

    // Cập nhật trạng thái ghế và thời gian giữ ghế
    const updatedSeats = showtime.seats.map((row) => {
      return {
        ...row,
        seats: row.seats.map((item) => {
          // Kiểm tra ghế có trong danh sách ghế đã chọn không
          const isHolding = selectedSeats.some(
            (selected) => selected.number === item.number
          );

          // Tính thời gian giữ ghế
          const newHoldExpiresAt = isHolding
            ? Date.now() + 5 * 60 * 1000
            : item.holdExpiresAt; // 5 phút

          return {
            ...item,
            status: isHolding ? "holding" : item.status, // Đánh dấu ghế là đang giữ nếu có
            userId: isHolding ? userId : item.userId, // Ghi lại ID người giữ ghế
            holdExpiresAt: isHolding ? newHoldExpiresAt : item.holdExpiresAt, // Ghi lại thời gian hết hạn
          };
        }),
      };
    });

    await ctx.db.replace(showtimeId, { ...showtime, seats: updatedSeats });

    return { message: "Seats held successfully" };
  },
});

export const releaseExpiredHolds = mutation({
  args: {
    showtimeId: v.id("showtimes"), // Nhận showtimeId làm tham số đầu vào
  },
  handler: async (ctx, { showtimeId }) => {
    // Lấy suất chiếu từ cơ sở dữ liệu
    const showtime = await ctx.db.get(showtimeId);
    if (!showtime) {
      throw new Error("Showtime not found");
    }

    // Cập nhật trạng thái ghế
    const updatedSeats = showtime.seats.map((row) => {
      return {
        ...row,
        seats: row.seats.map((item) => {
          // Kiểm tra thời gian giữ ghế đã hết hạn
          const isExpired =
            item.holdExpiresAt &&
            isAfter(new Date(), new Date(item.holdExpiresAt));
          return {
            ...item,
            status: isExpired ? "nomal" : item.status, // Đặt ghế thành "available" nếu đã hết hạn
            userId: isExpired ? undefined : item.userId, // Xóa ID người giữ ghế
            holdExpiresAt: isExpired ? undefined : item.holdExpiresAt, // Xóa thời gian giữ ghế
          };
        }),
      };
    });

    await ctx.db.replace(showtimeId, { ...showtime, seats: updatedSeats });

    return { message: "Expired holds released successfully" };
  },
});

export const updateShowtimeStatus = mutation({
  args: {
    showtimeId: v.id("showtimes"),
    selectedSeats: v.array(
      v.object({
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
        number: v.string(),
        type: v.union(
          v.literal("empty"),
          v.literal("standard"),
          v.literal("vip"),
          v.literal("couple")
        ),
        isBooked: v.boolean(),
        status: v.string(),
      })
    ),
  },
  handler: async (ctx, { showtimeId, selectedSeats }) => {
    // Lấy suất chiếu từ cơ sở dữ liệu
    const showtime = await ctx.db.get(showtimeId);
    if (!showtime) {
      throw new Error("Showtime not found");
    }

    const updatedSeats = showtime.seats.map((row) => {
      return {
        ...row,
        seats: row.seats.map((item) => {
          const selectedSeat = selectedSeats.find(
            (selected) => selected.number === item.number
          );

          if (selectedSeat && item.status !== "available") {
            throw new Error(`Seat ${item.number} has already been booked.`);
          }

          if (selectedSeat) {
            return {
              ...item,
              isBooked: true,
              status: "paid",
            };
          }

          return item;
        }),
      };
    });

    await ctx.db.replace(showtimeId, { ...showtime, seats: updatedSeats });

    return { message: "paid successfully" };
  },
});

export const updateShowtimeCancel = mutation({
  args: {
    showtimeId: v.id("showtimes"),
    selectedSeats: v.array(
      v.object({
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
        number: v.string(),
        type: v.union(
          v.literal("empty"),
          v.literal("standard"),
          v.literal("vip"),
          v.literal("couple")
        ),
        isBooked: v.boolean(),
        status: v.string(),
      })
    ),
  },
  handler: async (ctx, { showtimeId, selectedSeats }) => {
    // Lấy suất chiếu từ cơ sở dữ liệu
    const showtime = await ctx.db.get(showtimeId);
    if (!showtime) {
      throw new Error("Showtime not found");
    }

    // Cập nhật ghế ngồi
    const updatedSeats = showtime.seats.map((row) => {
      return {
        ...row,
        seats: row.seats.map((item) => {
          // Tìm ghế trong danh sách selectedSeats
          const selectedSeat = selectedSeats.find(
            (selected) => selected.number === item.number
          );

          // Nếu ghế đã được chọn và ghế không có trạng thái "booked", cập nhật trạng thái của nó
          if (selectedSeat && item.status !== "paid") {
            return {
              ...item,
              isBooked: false, // Hủy giữ chỗ
              status: "available", // Đặt lại trạng thái ghế thành có sẵn
            };
          }

          // Nếu ghế đã có trạng thái "booked", bỏ qua không thay đổi
          return item;
        }),
      };
    });

    // Lưu lại cập nhật vào cơ sở dữ liệu
    await ctx.db.replace(showtimeId, { ...showtime, seats: updatedSeats });

    return {
      message: "Seats canceled successfully, booked seats were not affected",
    };
  },
});
