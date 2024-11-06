declare module "react-slick" {
    import * as React from "react";
  
    interface SliderProps {
      dots?: boolean;
      infinite?: boolean;
      speed?: number;
      slidesToShow?: number;
      slidesToScroll?: number;
      autoplay?: boolean;
      arrows?: boolean;
      className?: string;
      // Thêm các thuộc tính khác nếu cần
    }
  
    export default class Slider extends React.Component<SliderProps> {}
  }
  