import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

export const TicketSelect = () => {
  return (
    <div className="md:flex md:flex-col">
      <h1
        className="text-white font-bold text-3xl py-5 text-center "
        style={{
          textShadow:
            "0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.6), 0 0 30px rgba(255, 255, 255, 0.4)",
        }}
      >
        Tickets Select
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="border border-white w-full p-3 space-y-2 text-white ">
          <p className="hover:text-yellow-300">ADULT</p>
          <p className="text-yellow-300">SINGLE TICKET</p>
          <div className="hover:bg-yellow-300 rounded-lg w-20 h-8 bg-slate-400 flex items-center gap-x-2 justify-around p-3">
            <Button
              size="iconSm"
              variant="transparent"
              className="size-6  hover:bg-slate-400 rounded-full "
            >
              <Minus className="size-4 rounded-full " />
            </Button>
            <span>0</span>
            <Button
              variant="transparent"
              size="iconSm"
              className="size-6 hover:bg-slate-400 rounded-full"
            >
              <Plus className="size-4" />
            </Button>
          </div>
        </div>
        <div className="border border-white p-3 space-y-2 text-white ">
          <p className="hover:text-yellow-300">STUDENT - ELDERLY PERSON</p>
          <p className="text-yellow-300">SINGLE TICKET</p>
          <div className="hover:bg-yellow-300 rounded-lg w-20 h-8 bg-slate-400 flex items-center gap-x-2 justify-around p-3">
            <Button
              size="iconSm"
              variant="transparent"
              className="size-6  hover:bg-slate-400 rounded-full "
            >
              <Minus className="size-4 rounded-full " />
            </Button>
            <span>0</span>
            <Button
              variant="transparent"
              size="iconSm"
              className="size-6 hover:bg-slate-400 rounded-full"
            >
              <Plus className="size-4" />
            </Button>
          </div>
        </div>
        <div className="border border-white p-3 space-y-2 text-white ">
          <p className="hover:text-yellow-300">COUPLE</p>
          <p className="text-yellow-300">COUPLE TICKET</p>
          <div className="hover:bg-yellow-300 rounded-lg w-20 h-8 bg-slate-400 flex items-center gap-x-2 justify-around p-3">
            <Button
              size="iconSm"
              variant="transparent"
              className="size-6  hover:bg-slate-400 rounded-full "
            >
              <Minus className="size-4 rounded-full " />
            </Button>
            <span>0</span>
            <Button
              variant="transparent"
              size="iconSm"
              className="size-6 hover:bg-slate-400 rounded-full"
            >
              <Plus className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
