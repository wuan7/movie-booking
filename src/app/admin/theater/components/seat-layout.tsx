import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { SeatList } from "./seat-list";

export const SeatLayout = () => {
  return (
    <div className=" flex overflow-auto shadow-lg w-full">
      <TransformWrapper
        initialScale={0.8} // Thiết lập mức zoom mặc định là 0.5 (50% so với kích thước thật)
        minScale={0.6} // Thiết lập mức zoom nhỏ nhất là 0.2 (20% so với kích thước thật)
      >
        <TransformComponent>
          <div className="bg-gradient-to-b w-full  from-[#0F172A] to-[#131d36]">
            <SeatList />
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
};
