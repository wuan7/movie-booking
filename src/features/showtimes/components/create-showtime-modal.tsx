import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCurrentShowtime } from "@/features/showtimes/store/use-showtime";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useCreateShowtimeModal } from "../store/use-create-showtime-model";
import { Button } from "@/components/ui/button";
import { CreateBookingModal } from "./create-booking-modal";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { CircleX } from "lucide-react";
import { toast } from "sonner";
import { useCreateBookingModal } from "../store/use-create-booking";
interface TicketPrice {
  seatType: "standard" | "vip" | "couple";
  price: number;
}
type SeatType = "standard" | "vip" | "couple";

type seatValue = {
  number: string;
  isBooked: boolean;
  status: string;
  type: "standard" | "vip" | "couple" | "empty";
  centerType?: "first-left-row" | "first-right-row" | "first-row" | "middle-left-row" | "middle-row" | "middle-right-row" | "last-left-row" | "last-row" | "last-right-row" | "nomal" | undefined;
};
export const CreateShowtimeModal = () => {
  const [showtime] = useCurrentShowtime();
  const [selectedSeats, setSelectedSeats] = useState<seatValue[]>([]);
  const [open, setOpen] = useCreateShowtimeModal();
  const [, setBookingOpen] = useCreateBookingModal();
  console.log(showtime);
  console.log(selectedSeats);
  const handleClose = () => {
    setOpen(false);
  };

 
  const handleTotalAmount = (seats: seatValue[]) => {
    const priceMap = showtime?.[0]?.ticketPrices.reduce(
      (acc: Record<SeatType, number>, priceObj: TicketPrice) => {
        acc[priceObj.seatType] = priceObj.price;
        return acc;
      },
      {} as Record<SeatType, number>
    );
  
    if (!priceMap) return 0;
  
    const totalAmount = seats
      .filter(seat => !seat.isBooked) // Lọc ghế chưa được đặt
      .reduce((total, seat) => {
        // Ensure that seat.seatType is a valid SeatType
        const seatType = seat.type as SeatType;
        return total + (priceMap[seatType] || 0);
      }, 0); 
  
    return totalAmount;
  };
  
const totalPrice = handleTotalAmount(selectedSeats);

const handleBuyTicket = () => {
  if (selectedSeats.length === 0) {
    toast.warning("Vui lòng chọn ghế");
    return;
  }
  setBookingOpen(true);
  toast.success(`Bạn đã mua vé thành công với tổng tiền ${totalPrice} VND`);

  
};

const handleSeatClick = (seat: seatValue) => {
  if (seat.type === "empty") return;
  if (seat.isBooked) return;
  if (seat.status === "pending") return;

  const isSelected = selectedSeats.some((s) => s.number === seat.number);
  
  // Nếu ghế đã được chọn, bỏ nó ra khỏi mảng selectedSeats
  if (isSelected) {
    setSelectedSeats(selectedSeats.filter((s) => s.number !== seat.number));
  } else {
    // Kiểm tra số ghế hiện tại trước khi thêm
    if (selectedSeats.length >= 7) {
      toast.warning("Bạn chỉ có thể chọn tối đa 7 ghế");
      return;
    }
    // Nếu ghế chưa được chọn, thêm nó vào mảng selectedSeats
    setSelectedSeats([...selectedSeats, seat]);
  }
};
  return (
    <>
    <CreateBookingModal selectedSeats={selectedSeats} totalPrice={totalPrice}/>
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="overflow-y-auto h-[80vh] p-6 max-w-5xl ">
        <DialogHeader className="">
          <DialogTitle>Mua vé xem phim</DialogTitle>
        </DialogHeader>

        <>
          <div className=" flex justify-center  shadow-lg w-[500px] h-full  overflow-auto md:min-h-[400px] md:w-full bg-gradient-to-b   from-[#0F172A] to-[#131d36]">
            <TransformWrapper
              centerOnInit
              initialScale={0.8} // Thiết lập mức zoom mặc định là 0.5 (50% so với kích thước thật)
              minScale={0.6} // Thiết lập mức zoom nhỏ nhất là 0.2 (20% so với kích thước thật)
            >
              <TransformComponent>
                <div className=" flex flex-col  max-w-full  min-w-max h-full">
                  <div className=" w-full flex justify-center relative my-3">
                    <div className="p-2 min-w-[250px] max-w-full h-32 ">
                      <Image
                        src={"/img-screen.png"}
                        alt="screen"
                        fill
                        className="object-contain "
                      />
                    </div>
                    <div className="absolute inset-0 flex justify-center items-center pt-2 text-white text-2xl font-bold tracking-widest">
                      Screen
                    </div>
                  </div>
                  {/* Hàng ghế 1 */}
                  {showtime &&
                    showtime[0].seats.map((seat, index) => (
                      <div key={index} className=" flex ">
                        <div className="w-14 h-14 p-4 flex justify-center items-center">
                          <Button
                            variant="transparent"
                            className="size-9  text-white text-sm font-semibold hover:bg-transparent"
                          >
                            {seat.rowNumber}
                          </Button>
                        </div>
                        {seat.seats.map((seat) => {
                          return (
                            <div
                              key={seat.number}
                              className={cn(
                                "h-14 w-14 p-4  flex justify-center items-center ",
                                seat.type === "couple" && "w-28 ",
                                seat.type === "standard" && "",
                                seat.centerType === "first-left-row" &&
                                  "border-l-2 border-red-500 rounded-tl-sm border-t-2",
                                seat.centerType === "first-right-row" &&
                                  "border-r-2 border-red-500 rounded-tr-sm border-t-2 ",
                                seat.centerType === "first-row" &&
                                  "border-t-2 border-red-500 ",
                                seat.centerType === "middle-left-row" &&
                                  "border-l-2 border-red-500",
                                seat.centerType === "middle-right-row" &&
                                  "border-r-2 border-red-500",
                                seat.centerType === "last-left-row" &&
                                  "border-l-2 rounded-bl-sm border-b-2 border-red-500",
                                seat.centerType === "last-row" &&
                                  "border-b-2 border-red-500 ",
                                seat.centerType === "last-right-row" &&
                                  "border-r-2 border-b-2 rounded-br-sm border-red-500",
                             
                              )}
                            >
                              <Button
                                className={cn(
                                  "size-9  text-purple-600 text-sm font-semibold bg-white hover:bg-white/85",
                                  seat.type === "empty" &&
                                    "!bg-transparent !text-transparent !cursor-default",
                                  seat.type === "couple" &&
                                    "w-full h-9 text-white bg-pink-500 hover:bg-pink-500/75",
                                  seat.type === "standard" &&
                                    "text-white bg-purple-500 hover:bg-purple-500/75",
                                  seat.type === "vip" &&
                                    "text-white bg-red-500 hover:bg-red-500/75",
                                  seat.isBooked === true && "bg-gray-600 hover:bg-gray-600 cursor-default",
                                  seat.status === "pending" && "bg-blue-500 hover:bg-blue-500/75 cursor-default",
                                  selectedSeats.some(
                                    (s) => s.number === seat.number
                                  ) && "bg-yellow-500 hover:bg-yellow-500"
                                )}
                                onClick={() => handleSeatClick(seat)}
                              >
                                {seat.number}
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                </div>
              </TransformComponent>
            </TransformWrapper>
          </div>
          <div className="w-full h-full p-5 bg-white">
            <div className="flex flex-wrap justify-center gap-3">
              <div className="flex items-center justify-center gap-x-2">
                <div className="size-6 rounded-sm bg-gray-600" />
                <p className="text-sm font-medium ">Đã đặt</p>
              </div>
              
              <div className="flex items-center justify-center gap-x-2">
                <div className="size-6 rounded-sm bg-yellow-500" />
                <p className="text-sm font-medium ">Ghế bạn chọn</p>
              </div>
              <div className="flex items-center justify-center gap-x-2">
                <div className="size-6 rounded-sm bg-purple-500" />
                <p className="text-sm font-medium ">Ghế thường</p>
              </div>
              <div className="flex items-center justify-center gap-x-2">
                <div className="size-6 rounded-sm bg-red-500" />
                <p className="text-sm font-medium ">Ghế VIP</p>
              </div>
              <div className="flex items-center justify-center gap-x-2">
                <div className="size-6 rounded-sm bg-pink-500" />
                <p className="text-sm font-medium ">Ghế đôi</p>
              </div>
              <div className="flex items-center justify-center gap-x-2">
                <div className="size-6 rounded-sm border border-red-500" />
                <p className="text-sm font-medium ">Vùng trung tâm</p>
              </div>
            </div>
          </div>
          <div>
            <div className="border-b py-2">
              <div className="flex items-center gap-x-1">
                <div className="bg-red-500 text-white flex items-center justify-center w-8 h-6 text-xs rounded-sm">
                  18 <span>+</span>
                </div>
                <h1 className="font-semibold">Tee Yod: Quỷ Ăn Tạng Phần 2</h1>
              </div>
              <p className="text-sm text-red-500 mt-1">
                21:40 ~ 23:31 · Hôm nay, 14/10 · Phòng chiếu P2 · 2D Phụ đề
              </p>
            </div>
            <div className="flex justify-between py-2 border-b">
              <p className="text-muted-foreground text-sm">Chỗ ngồi</p>
              {selectedSeats.length > 0 && (
                <div className="p-1 border rounded-sm flex items-center">
                  <div className="flex gap-x-1">
                    {selectedSeats.map((seat) => (
                      <p key={seat.number} className="text-sm">
                        {seat.number}
                      </p>
                    ))}
                  </div>{" "}
                  <CircleX
                    onClick={() => setSelectedSeats([])}
                    className="size-4 cursor-pointer ml-1 text-red-500"
                  />
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-muted-foreground text-sm">Tạm tính</p>
              <p className="font-bold ">{totalPrice.toLocaleString("vi-VN")} đ</p>
            </div>
            <Button
              variant="destructive"
              className=""
              onClick={handleBuyTicket}
            >
              Mua vé
            </Button>
          </div>
        </>
      </DialogContent>
    </Dialog>
    
    </>
  );
};
