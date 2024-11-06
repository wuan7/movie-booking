import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";
const schema = defineSchema({
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    role: v.optional(v.string()),
  }).index("email", ["email"]),

  movies: defineTable({
    title: v.string(),
    description: v.string(),
    director: v.string(),
    cast: v.array(v.string()),
    genre: v.array(v.string()),
    duration: v.number(),
    releaseDate: v.string(),
    nation: v.string(),
    posterUrl: v.optional(v.id("_storage")),
    trailerUrl: v.optional(v.string()),
    status: v.union(
      v.literal("upcoming"),
      v.literal("showing"),
      v.literal("not_showing")
    ),
    age: v.union(
      v.literal("18"),
      v.literal("16"),
      v.literal("13"),
      v.literal("K"),
      v.literal("P")
    ),
  })
    .index("by_genre", ["genre"])
    .index("by_releaseDate", ["releaseDate"])
    .index("by_status", ["status"])
    .index("by_title", ["title"]),

  cinemaCompanies: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    logoUrl: v.optional(v.id("_storage")),
    posterUrl: v.optional(v.id("_storage")),
    storesNumber: v.optional(v.number()),
  }).index("by_name", ["name"]),

  branches: defineTable({
    cinemaCompanyId: v.optional(v.id("cinemaCompanies")),
    name: v.string(),
    location: v.string(),
    address: v.string(),
    logoUrl: v.optional(v.string()),
    contactNumber: v.optional(v.string()),
  })
    .index("by_cinemaCompanyId", ["cinemaCompanyId"])
    .index("by_location", ["location"]),
  screeningRooms: defineTable({
    branchId: v.optional(v.id("branches")),
    name: v.string(),
    totalSeats: v.optional(v.number()),
    description: v.optional(v.string()),
    roomType: v.optional(
      v.union(
        v.literal("2D"),
        v.literal("3D"),
        v.literal("IMAX"),
        v.literal("4DX")
      )
    ),
  })
    .index("by_branchId", ["branchId"])
    .index("by_name", ["name"]),
  rows: defineTable({
    screeningRoomId: v.optional(v.id("screeningRooms")),
    rowNumber: v.number(),
    rowName: v.string(),
  }).index("by_screeningRoom_and_rowNumber", ["screeningRoomId", "rowNumber"]),

  seats: defineTable({
    rowId: v.optional(v.id("rows")),
    number: v.string(),
    type: v.union(
      v.literal("standard"),
      v.literal("vip"),
      v.literal("couple"),
      v.literal("empty")
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
  }).index("by_rowId_and_number", ["rowId", "number"]),

  showtimes: defineTable({
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
    seats: v.array(
      v.object({
        rowNumber: v.number(),
        seats: v.array(
          v.object({
            number: v.string(),
            type: v.union(
              v.literal("standard"),
              v.literal("vip"),
              v.literal("couple"),
              v.literal("empty")
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
            isBooked: v.boolean(),
            status: v.string(),
            userId: v.optional(v.string()), // ID của người đã giữ ghế
            holdExpiresAt: v.optional(v.number()),
          })
        ),
      })
    ),
  })
    .index("by_movieId", ["movieId"])
    .index("by_screeningRoomId", ["screeningRoomId"])
    .index("by_showDate", ["showDate"])
    .index("by_startTime", ["startTime"])
    .index("by_showDate_movie_id_startTime", [
      "showDate",
      "movieId",
      "startTime",
    ]),

  bookings: defineTable({
    userId: v.optional(v.id("users")),
    movieId: v.id("movies"),
    email: v.string(),
    name: v.string(),
    phone: v.string(),
    showtimeId: v.id("showtimes"),
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
    status: v.union(
      v.literal("available"),
      v.literal("pending"),
      v.literal("paid"),
      v.literal("cancelled"),
      v.literal("expired")
    ),
    paymentMethod: v.string(),
    paidAt: v.optional(v.number()),
  })
    .index("by_userId", ["userId"])
    .index("by_movieId", ["movieId"])
    .index("by_showtimeId", ["showtimeId"])
    .index("by_paymentStatus", ["status"]),

  messages: defineTable({
    text: v.string(),
    image: v.optional(v.id("_storage")),
    userId: v.id("users"),
    movieId: v.id("movies"),
    parentMessageId: v.optional(v.id("messages")),
    tags: v.optional(v.array(v.string())),
    updatedAt: v.optional(v.number()),
    rating: v.number(),
  })
    .index("by_movie_id", ["movieId"])
    .index("by_user_id", ["userId"])
    .index("by_parent_message_id", ["parentMessageId"])
    .index("by_movie_id_parent_message_id", ["movieId", "parentMessageId"]),
  replies: defineTable({
    messageId: v.id("messages"),
    text: v.string(),
    image: v.optional(v.id("_storage")),
    userId: v.id("users"),
    movieId: v.id("movies"),
    updatedAt: v.optional(v.number()),
  })
    .index("by_message_id", ["messageId"])
    .index("by_movie_id", ["movieId"])
    .index("by_movie_id_message_id", ["movieId", "messageId"])
    .index("by_user_id", ["userId"]),
  reactions: defineTable({
    movieId: v.id("movies"),
    userId: v.id("users"),
    messageId: v.optional(v.id("messages")),
    replyId: v.optional(v.id("replies")),
    value: v.string(),
  })
    .index("by_movie_id", ["movieId"])
    .index("by_user_id", ["userId"])
    .index("by_message_id", ["messageId"])
    .index("by_reply_id", ["replyId"]),

  reviews: defineTable({
    userId: v.id("users"), // ID của người dùng (tham chiếu đến bảng users)
    movieId: v.id("movies"), // ID của phim (tham chiếu đến bảng movies)
    rating: v.number(), // Đánh giá phim (1-5)
    comment: v.optional(v.string()), // Bình luận (tuỳ chọn)
    createdAt: v.number(), // Thời gian đánh giá (timestamp)
    updatedAt: v.number(), // Thời gian cập nhật đánh giá (timestamp)
  })
    .index("by_userId", ["userId"])
    .index("by_movieId", ["movieId"]),

  promotions: defineTable({
    code: v.string(),
    description: v.string(),
    discountPercentage: v.number(),
    validFrom: v.number(), // Thời gian bắt đầu khuyến mãi (timestamp)
    validTo: v.number(), // Thời gian kết thúc khuyến mãi (timestamp)
    createdAt: v.number(), // Thời gian thêm khuyến mãi (timestamp)
    updatedAt: v.number(), // Thời gian cập nhật khuyến mãi (timestamp)
  })
    .index("by_code", ["code"]) // Tìm kiếm khuyến mãi theo mã
    .index("by_validity", ["validFrom", "validTo"]), // Tìm kiếm khuyến mãi theo thời gian hiệu lực

  blogs: defineTable({
    title: v.string(),
    slug: v.string(),
    content: v.string(),
    author: v.optional(v.string()),
    posterUrl: v.optional(v.id("_storage")),
    readTime: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    categoryId: v.id("categories"),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    isPublished: v.boolean(),
    publishedAt: v.optional(v.number()),
    views: v.optional(v.number()),
  })
    .index("by_slug", ["slug"])
    .index("by_categoryId", ["categoryId"])
    .index("by_author", ["author"])
    .index("by_isPublished", ["isPublished"])
    .index("by_publishedAt", ["publishedAt"]),
  blogPosts: defineTable({
    slug: v.string(),
    title: v.string(),
    content: v.string(),
    posterUrl: v.optional(v.id("_storage")),
  }).index("by_slug", ["slug"]),
  banners: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    posterUrl: v.optional(v.id("_storage")),
    link: v.optional(v.string()),
    isPublished: v.boolean(),
    publishedAt: v.optional(v.number()),
  }).index("by_isPublished", ["isPublished"]),

  categories: defineTable({
    name: v.string(),
  }),
  
});

export default schema;
