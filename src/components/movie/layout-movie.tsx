import { useState } from "react";
import { ComingSoon } from "./coming-soon";
import { NowShowing } from "./now-showing";
import { cn } from "@/lib/utils";
export const LayoutMovie = () => {
  const [layout, setLayout] = useState<"now" | "commingSoon">("now");
  return (
    <div className="h-auto w-full flex flex-col  ">
      <div className="bg-[#cf256f] py-2 flex justify-center gap-x-5">
        
        <button
          className="relative px-6 py-3 font-bold text-white rounded-lg group"
          onClick={() => setLayout("now")}
        >
          <span className={cn("absolute inset-0 w-full h-full transition duration-300 transform  bg-purple-800 ease opacity-80",
            layout === "now" ? "translate-x-0 translate-y-0" : "-translate-x-1 -translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0"
          )}></span>
          <span className={cn("absolute inset-0 w-full h-full transition duration-300 transform  bg-cyan-800 ease opacity-80  mix-blend-screen",
            layout === "now" ? "translate-x-0 translate-y-0" : "translate-x-1 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0"
          )}></span>
          <span
            className="relative"
            style={{
              textShadow:
                "0 0 5px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.6), 0 0 30px rgba(255, 255, 255, 0.4)",
            }}
          >
            Phim đang chiếu
          </span>
        </button>
        <button
          className="relative px-6 py-3 font-bold text-white rounded-lg group"
          onClick={() => setLayout("commingSoon")}
        >
          <span className={cn("absolute inset-0 w-full h-full transition duration-300 transform  bg-purple-800 ease opacity-80",
            layout === "commingSoon" ? "translate-x-0 translate-y-0" : "-translate-x-1 -translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0"
          )}></span>
          <span className={cn("absolute inset-0 w-full h-full transition duration-300 transform  bg-cyan-800 ease opacity-80  mix-blend-screen",
            layout === "commingSoon" ? "translate-x-0 translate-y-0" : "translate-x-1 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0"
          )}></span>
          <span
            className="relative"
            style={{
              textShadow:
                "0 0 5px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.6), 0 0 30px rgba(255, 255, 255, 0.4)",
            }}
          >
            Phim sắp chiếu
          </span>
        </button>
      </div>
      {layout === "now" ? <NowShowing /> : <ComingSoon />}
    </div>
  );
};
