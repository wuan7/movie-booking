"use client";
import { useCurrentUser } from "@/features/auth/api/use-current-user";
import { useGetBookingByUserId } from "@/features/booking/api/use-get-booking-by-user-id";
import { Id } from "../../../convex/_generated/dataModel";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { Loader, TriangleAlert } from "lucide-react";
import Link from "next/link";

const Ticketpage = () => {
  const currentUser = useCurrentUser();
  const userId = currentUser?.data?._id as Id<"users">;
  const { data, isLoading } = useGetBookingByUserId({ userId });

  if (isLoading) {
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
        <TriangleAlert className="size-6  text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Bạn chưa mua vé nào.
        </span>
      </div>
    );
  }
  return (
    <div className="min-h-96">
      <h1 className="font-bold text-xl p-2">Thông tin mua vé</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ảnh</TableHead>
            <TableHead>Tên phim</TableHead>
            <TableHead>Tên người mua</TableHead>
            <TableHead>Số điện thoại</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Ghế</TableHead>
            <TableHead>Thanh toán</TableHead>
            <TableHead>Thanh toán lúc</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-right">Tổng tiền</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((ticket) => {
            const date = ticket.paidAt ? new Date(ticket.paidAt) : null;
            const formattedDate = date
              ? date.toLocaleString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })
              : "N/A";
            return (
              <TableRow key={ticket._id}>
                <TableCell>
                  <Link href={`/movie/${ticket.movie._id}`}>
                    <Image
                      alt=""
                      src={ticket.movie.posterUrl || ""}
                      width={70}
                      height={70}
                    />
                  </Link>
                </TableCell>
                <TableCell className="font-medium">
                  <Link href={`/movie/${ticket.movie._id}`}>
                    {ticket.movie.title}
                  </Link>
                </TableCell>
                <TableCell>{ticket.name}</TableCell>
                <TableCell>{ticket.phone}</TableCell>
                <TableCell>{ticket.email}</TableCell>
                <TableCell>
                  {ticket.selectedSeats &&
                    ticket.selectedSeats.map((seat) => `${seat.number} `)}
                </TableCell>
                <TableCell>{ticket.paymentMethod}</TableCell>
                <TableCell>{formattedDate}</TableCell>
                <TableCell>
                  {ticket.status === "pending"
                    ? "Không thành công"
                    : "Thành công"}
                </TableCell>
                <TableCell className="text-right font-bold">
                  {ticket.totalPrice.toLocaleString("vi-VN")} đ
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default Ticketpage;
