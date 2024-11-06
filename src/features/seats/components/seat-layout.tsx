import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { SeatList } from "./seat-list";



export const SeatLayout = () => {
    return (
      <TransformWrapper>
        <TransformComponent >
            <div className="bg-gradient-to-b w-full  from-[#0F172A] to-[#131d36]">
              <SeatList/>
            </div>
        </TransformComponent>
      </TransformWrapper>
    );
  };