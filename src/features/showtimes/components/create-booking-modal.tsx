"use client";
import {  useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateBookingModal } from "../store/use-create-booking";
import { Separator } from "@/components/ui/separator";
import { Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useCurrentShowtime } from "../store/use-showtime";
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import axios from "axios";
import { useCreateBooking } from "@/features/booking/api/use-create-booking";
import { useMovieId } from "@/hooks/use-movie-id";

interface CreateBookingProps {
  selectedSeats: seatValue[];
  totalPrice : number;
}

type seatValue = {
  number: string;
  isBooked: boolean;
  status: string;
  type: "standard" | "vip" | "couple" | "empty";
  centerType?: "first-left-row" | "first-right-row" | "first-row" | "middle-left-row" | "middle-row" | "middle-right-row" | "last-left-row" | "last-row" | "last-right-row" | "nomal" | undefined;
};

const handleDate = (startTime : string | undefined) => {
  console.log(startTime)
  if (startTime) {
    const utcDate = toZonedTime(startTime, "UTC");
    const formattedDate = format(utcDate, "EEEE dd/MM/yyyy");
    return formattedDate
  }
}

export const CreateBookingModal = ({selectedSeats, totalPrice}: CreateBookingProps) => {
  const movieId = useMovieId();
  const [showtime] = useCurrentShowtime();
  const showtimeId = showtime?.[0]._id ;
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("vnpay");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [term, setTerm] = useState(false);
 const {mutate} = useCreateBooking()
  const [open, setOpen] = useCreateBookingModal();
  const formattedStartTime = showtime?.[0]?.startTime.slice(11, 16);
  const formattedEndTime = showtime?.[0]?.endTime.slice(11, 16);
 
  const steps = [
    { id: 1, name: "Step 1", description: "CUSTOMER INFO" },
    { id: 2, name: "Step 2", description: "PAYMENT" },
  ];
  const nextStep = () => {
    if (!name || !email || !phone || !term) {
      toast.warning("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
    return;
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
    return;
  };
  const handleClose = () => {
    setName("");
    setPhone("");
    setEmail("");
    setTerm(false);
    setOpen(false);
  };

  const handlePayment = async () => {
   
    if(!paymentMethod) {
      toast.warning("Vui lòng chọn phương thức thanh toán");
      return;
    }
    if(!showtimeId || !selectedSeats){
      toast.warning("Vui lòng chọn ghế");
      return;
    }
    if(!movieId) {
      toast.warning("Vui lòng chọn phim");
      return;
    }
    try {
      toast.success("Đang xử lý, xin vui lòng chờ!");
      mutate({email, name, phone, showtimeId, selectedSeats, totalPrice, paymentMethod, movieId}, {
        onSuccess: async (data) => {
          toast.success("Đang điều hướng qua trang thanh toán, xin vui lòng chờ");
          console.log(data?.bookingId)
          const bookingId = data?.bookingId
         
          const response = await axios.post<{ url: string }>('/api/vnpay/create-payment-url', {
            amount : totalPrice,
            bookingId,
          });
          
          window.location.href = response.data.url;
        },
        onError: (error) => {
          toast.error("Failed to create booking");
          console.log(error);
        },
      });
     
   
      

    } catch (error) {
      console.error(error);
      toast.error('Lỗi khi  thanh toán');
    }
   
  }
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="overflow-y-auto h-[80vh] p-6 max-w-5xl bg-gradient-to-b   from-[#0F172A] to-[#131d36] text-white">
        <DialogHeader className="">
          <DialogTitle>Thanh toán</DialogTitle>
        </DialogHeader>

        <>
          <div className="flex flex-col w-full">
            <div className="w-full">
              <div className="flex gap-x-4">
                {steps.map((step) => (
                  <div key={step.id} className="flex items-center group">
                    <div
                      className={`flex flex-col items-center ${currentStep >= step.id ? "text-yellow-500" : "text-white"}`}
                    >
                      <p className="text-xs font-semibold">{step.id}</p>
                      <h1 className="text-xs font-semibold">
                        {step.description}
                      </h1>
                    </div>
                    <div
                      className={`h-0.5 w-11  ${currentStep >= step.id ? "bg-yellow-500" : "bg-white"} ml-2 group-last:hidden`}
                    ></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex md:flex-row flex-col w-full">
              {currentStep === 1 && (
                <div className="w-full md:w-1/2">
                  <div className="p-2 flex flex-col gap-y-3">
                    <form className="space-y-2">
                      <div>
                        <Label htmlFor="name">Name*</Label>
                        <Input
                          className="text-black"
                          required
                          id="name"
                          onChange={(e) => setName(e.target.value)}
                          value={name}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone number* </Label>
                        <Input
                          className="text-black"
                          required
                          id="phone"
                          onChange={(e) => setPhone(e.target.value)}
                          value={phone}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email*</Label>
                        <Input
                          className="text-black"
                          required
                          type="email"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          required
                          id="terms"
                          className="bg-white border"
                          checked={term}
                          onCheckedChange={(checked) => setTerm(checked === true)}
                        />
                        <Label htmlFor="terms">
                          Accept terms and conditions
                        </Label>
                      </div>
                    </form>
                    <div className="flex gap-x-2">
                      <Button
                        onClick={nextStep}
                        className="w-full bg-yellow-400 hover:bg-yellow-300 text-black"
                      >
                        CONTINUE
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              {currentStep === 2 && (
                <div className="w-full md:w-1/2">
                  <div className="p-2 flex flex-col gap-y-3">
                    <div
                      className={cn(
                        "flex items-center gap-x-2 border border-white/75 p-3 cursor-pointer rounded-sm",
                        paymentMethod === "vnpay" && "border-blue-600"
                      )}
                      onClick={() => setPaymentMethod("vnpay")}
                    >
                      <Image
                        src="/VNPAY.svg"
                        alt="logo"
                        width={40}
                        height={40}
                        className="rounded-sm"
                      />
                      <p>Pay with VNPAY</p>
                    </div>
                    <div className="flex items-center gap-x-2 border border-white/75 p-3 rounded-sm">
                      <Image
                        src="/momo.svg"
                        alt="logo"
                        width={30}
                        height={30}
                      />
                      <p>Pay with Momo (future)</p>
                    </div>
                    <div className="flex items-center gap-x-2 border border-white/75 p-3  rounded-sm">
                      <Image
                        src="/zalopay.svg"
                        alt="logo"
                        width={40}
                        height={40}
                      />
                      <p>Pay with ZALO PAY (future)</p>
                    </div>

                    <Separator />
                    <div className="flex items-center p-2 gap-x-2 group bg-gradient-to-r from-blue-500 to-blue-600 cursor-pointer hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-500 duration-500 rounded-sm">
                      <Tag className="size-5 text-yellow-500 transition-all group-hover:rotate-45 group-hover:scale-125" />
                      <div>
                        <h1 className="text-sm">
                          Select discounts or enter discount code
                        </h1>
                        <p className="text-xs">Apply discounts</p>
                      </div>
                    </div>
                    <div className="flex gap-x-2">
                      <Button
                        onClick={prevStep}
                        className="w-full bg-yellow-400 hover:bg-yellow-300 text-black"
                      >
                        BACK
                      </Button>
                      <Button className="w-full bg-yellow-400 hover:bg-yellow-300 text-black" onClick={handlePayment}>
                        SUBMIT
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="w-full md:w-1/2 p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-sm m-2">
                <div className="flex justify-between items-center">
                 
                  <h1 className="font-semibold">{showtime?.[0]?.movieName}</h1>
                 
                </div>
                <div className="space-y-2">
                 
                  <div>
                    <h1>{showtime?.[0]?.branchName}</h1>
                    <p className="text-xs">{showtime?.[0]?.branchAddress}</p>
                  </div>
                  <div>
                    <p className="text-yellow-400">Thời gian chiếu</p>
                    <p className="text-xs">{`${formattedStartTime} : ${formattedEndTime}`} {handleDate(showtime?.[0]?.startTime)}</p>
                  </div>
                  <div>
                    <p className="text-yellow-400">Phòng</p>
                    <p className="text-xs">{showtime?.[0]?.screeningRoomName}</p>
                  </div>
                  <div>
                    <p className="text-yellow-400">Ghế</p>
                    <div className="flex gap-x-2">
                      {selectedSeats?.map((seat) => <p key={seat.number} className="text-xs">{seat.number}</p>)}
                      <p className="text-xs">Số lượng: {selectedSeats.length} ghế</p>
                    </div>
                    
                  </div>
                  <div className="w-full h-0.5 border-b border-dashed"></div>
                  <div className="flex justify-between items-center">
                    <p className="text-yellow-400">Tổng tiền</p>
                    <h1 className="text-xl">{totalPrice.toLocaleString("vi-VN")} đ</h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      </DialogContent>
    </Dialog>
  );
};
