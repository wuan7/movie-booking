import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Seat } from "./seat";
import { useRows } from "../store/use-seats";

export const SeatList = () => {
  const [rows] = useRows();

  console.log("rows", rows)
  

  //   const seats = [
  //     {
  //       rowNumber: 1,
  //       rowName: "A",
  //       seats: [
  //         { number: "1", isCenter: false, type: "standard" },
  //         { number: "2", isCenter: false, type: "standard" },
  //         { number: "3", isCenter: false, type: "standard" },
  //         {
  //           number: "4",
  //           isCenter: true,
  //           type: "standard",
  //           centerType: "first-left-row",
  //         },
  //         {
  //           number: "5",
  //           isCenter: true,
  //           type: "standard",
  //           centerType: "first-row",
  //         },
  //         { number: "6", isCenter: true, type: "vip", centerType: "first-row" },
  //         { number: "7", isCenter: true, type: "vip", centerType: "first-row" },
  //         { number: "8", isCenter: false, type: "vip", centerType: "first-row" },
  //         { number: "9", isCenter: false, type: "vip", centerType: "first-right-row" },
  //         { number: "10", isCenter: false, type: "standard" },
  //         { number: "11", isCenter: false, type: "standard" },
  //         { number: "12", isCenter: false, type: "standard" },
  //         { number: "13", isCenter: false, type: "empty" },
  //         { number: "14", isCenter: false, type: "empty" },
  //         { number: "15", isCenter: false, type: "empty" },
  //         { number: "16", isCenter: false, type: "standard" },
  //       ],
  //     },
  //     {
  //       rowNumber: 2,
  //       rowName: "B",
  //       seats: [
  //         { number: "1", isCenter: false, type: "standard" },
  //         { number: "2", isCenter: false, type: "standard" },
  //         { number: "3", isCenter: false, type: "standard" },
  //         {
  //           number: "4",
  //           isCenter: true,
  //           type: "standard",
  //           centerType: "middle-left-row",
  //         },
  //         {
  //           number: "5",
  //           isCenter: true,
  //           type: "standard",
  //           centerType: "middle-row",
  //         },
  //         { number: "6", isCenter: true, type: "vip", centerType: "middle-row" },
  //         { number: "7", isCenter: true, type: "vip", centerType: "middle-row" },
  //         { number: "8", isCenter: false, type: "vip", centerType: "middle-row" },
  //         { number: "9", isCenter: false, type: "vip", centerType: "middle-right-row" },
  //         {
  //           number: "10",
  //           isCenter: false,
  //           type: "standard",
  //           centerType: "middle-last-row",
  //         },
  //         { number: "11", isCenter: false, type: "standard" },
  //         { number: "12", isCenter: false, type: "standard" },
  //         { number: "13", isCenter: false, type: "empty" },
  //         { number: "14", isCenter: false, type: "empty" },
  //         { number: "15", isCenter: false, type: "empty" },
  //         { number: "16", isCenter: false, type: "empty" },
  //       ],
  //     },
  //     {
  //       rowNumber: 2,
  //       rowName: "B",
  //       seats: [
  //         { number: "1", isCenter: false, type: "standard" },
  //         { number: "2", isCenter: false, type: "standard" },
  //         { number: "3", isCenter: false, type: "standard" },
  //         {
  //           number: "4",
  //           isCenter: true,
  //           type: "standard",
  //           centerType: "middle-left-row",
  //         },
  //         {
  //           number: "5",
  //           isCenter: true,
  //           type: "standard",
  //           centerType: "middle-row",
  //         },
  //         { number: "6", isCenter: true, type: "vip", centerType: "middle-row" },
  //         { number: "7", isCenter: true, type: "vip", centerType: "middle-row" },
  //         { number: "8", isCenter: false, type: "vip", centerType: "middle-row" },
  //         { number: "9", isCenter: false, type: "vip", centerType: "middle-right-row" },
  //         {
  //           number: "10",
  //           isCenter: false,
  //           type: "standard",
  //           centerType: "middle-last-row",
  //         },
  //         { number: "11", isCenter: false, type: "standard" },
  //         { number: "12", isCenter: false, type: "standard" },
  //         { number: "13", isCenter: false, type: "empty" },
  //         { number: "14", isCenter: false, type: "empty" },
  //         { number: "15", isCenter: false, type: "empty" },
  //         { number: "16", isCenter: false, type: "empty" },
  //       ],
  //     },
  //     {
  //       rowNumber: 2,
  //       rowName: "B",
  //       seats: [
  //         { number: "1", isCenter: false, type: "standard" },
  //         { number: "2", isCenter: false, type: "standard" },
  //         { number: "3", isCenter: false, type: "standard" },
  //         {
  //           number: "4",
  //           isCenter: true,
  //           type: "standard",
  //           centerType: "middle-left-row",
  //         },
  //         {
  //           number: "5",
  //           isCenter: true,
  //           type: "standard",
  //           centerType: "middle-row",
  //         },
  //         { number: "6", isCenter: true, type: "vip", centerType: "middle-row" },
  //         { number: "7", isCenter: true, type: "vip", centerType: "middle-row" },
  //         { number: "8", isCenter: false, type: "vip", centerType: "middle-row" },
  //         { number: "9", isCenter: false, type: "vip", centerType: "middle-right-row" },
  //         {
  //           number: "10",
  //           isCenter: false,
  //           type: "standard",
  //           centerType: "middle-last-row",
  //         },
  //         { number: "11", isCenter: false, type: "standard" },
  //         { number: "12", isCenter: false, type: "standard" },
  //         { number: "13", isCenter: false, type: "empty" },
  //         { number: "14", isCenter: false, type: "empty" },
  //         { number: "15", isCenter: false, type: "empty" },
  //         { number: "16", isCenter: false, type: "empty" },
  //       ],
  //     },
  //     {
  //       rowNumber: 2,
  //       rowName: "B",
  //       seats: [
  //         { number: "1", isCenter: false, type: "standard" },
  //         { number: "2", isCenter: false, type: "standard" },
  //         { number: "3", isCenter: false, type: "standard" },
  //         {
  //           number: "4",
  //           isCenter: true,
  //           type: "standard",
  //           centerType: "middle-left-row",
  //         },
  //         {
  //           number: "5",
  //           isCenter: true,
  //           type: "standard",
  //           centerType: "middle-row",
  //         },
  //         { number: "6", isCenter: true, type: "vip", centerType: "middle-row" },
  //         { number: "7", isCenter: true, type: "vip", centerType: "middle-row" },
  //         { number: "8", isCenter: false, type: "vip", centerType: "middle-row" },
  //         { number: "9", isCenter: false, type: "vip", centerType: "middle-right-row" },
  //         {
  //           number: "10",
  //           isCenter: false,
  //           type: "standard",
  //           centerType: "middle-last-row",
  //         },
  //         { number: "11", isCenter: false, type: "standard" },
  //         { number: "12", isCenter: false, type: "standard" },
  //         { number: "13", isCenter: false, type: "empty" },
  //         { number: "14", isCenter: false, type: "empty" },
  //         { number: "15", isCenter: false, type: "empty" },
  //         { number: "16", isCenter: false, type: "empty" },
  //       ],
  //     },
  //     {
  //       rowNumber: 3,
  //       rowName: "A",
  //       seats: [
  //         { number: "1", isCenter: false, type: "standard" },
  //         { number: "2", isCenter: false, type: "standard" },
  //         { number: "3", isCenter: false, type: "standard" },
  //         {
  //           number: "4",
  //           isCenter: true,
  //           type: "standard",
  //           centerType: "last-left-row",
  //         },
  //         {
  //           number: "5",
  //           isCenter: true,
  //           type: "standard",
  //           centerType: "last-row",
  //         },
  //         { number: "6", isCenter: true, type: "vip", centerType: "last-row" },
  //         { number: "7", isCenter: true, type: "vip", centerType: "last-row" },
  //         { number: "8", isCenter: false, type: "vip", centerType: "last-row" },
  //         { number: "9", isCenter: false, type: "vip", centerType: "last-right-row" },
  //         {
  //           number: "10",
  //           isCenter: false,
  //           type: "standard",
  //           centerType: "last-last-row",
  //         },
  //         { number: "11", isCenter: false, type: "standard" },
  //         { number: "12", isCenter: false, type: "standard" },
  //         { number: "13", isCenter: false, type: "empty" },
  //         { number: "14", isCenter: false, type: "empty" },
  //         { number: "15", isCenter: false, type: "empty" },
  //         { number: "16", isCenter: false, type: "empty" },
  //       ],
  //     },
  //     {
  //       rowNumber: 3,
  //       rowName: "D",
  //       seats: [
  //         { number: "1", isCenter: false, type: "couple" },
  //         { number: "2", isCenter: false, type: "couple" },
  //         { number: "2", isCenter: false, type: "empty" },
  //         { number: "2", isCenter: false, type: "empty" },
  //         { number: "3", isCenter: false, type: "couple" },
  //         { number: "2", isCenter: false, type: "empty" },
  //         { number: "2", isCenter: false, type: "empty" },
  //         { number: "2", isCenter: false, type: "empty" },
  //         { number: "1", isCenter: false, type: "couple" },

  //       ],
  //     },
  //   ];
  return (
    <div className=" flex flex-col  overflow-x-auto custom-scrollbar overflow-y-hidden  p-5  shadow-lg max-w-full">
      <div className=" flex flex-col min-w-max h-full py-5">
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
        {rows && rows.map((row) => (
            <div key={row.rowNumber} className="seat-row flex ">
                <div
                  className="seat-box w-14 h-14 p-4 flex justify-center items-center"
                >
                  <Button
                    variant="transparent"
                    className="size-9  text-white text-sm font-semibold hover:bg-transparent"
                  >
                    {row.rowName}
                  </Button>
                </div>
                  <Seat key={row._id} rowId={row._id}  />
            </div>
              ))}
      </div>
    </div>
  );
};
