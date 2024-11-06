import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Seat } from "./seat";
import { useRows } from "@/features/seats/store/use-seats";

export const SeatList = () => {
  const [rows] = useRows();

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
        {rows &&
          rows.map((row) => (
            <div key={row.rowNumber} className="seat-row flex ">
              <div className="seat-box w-14 h-14 p-4 flex justify-center items-center">
                <Button
                  variant="transparent"
                  className="size-9  text-white text-sm font-semibold hover:bg-transparent"
                >
                  {row.rowName}
                </Button>
              </div>
              <Seat key={row._id} rowId={row._id} />
            </div>
          ))}
      </div>
    </div>
  );
};
