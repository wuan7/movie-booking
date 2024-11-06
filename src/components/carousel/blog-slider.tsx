"use client";
import React from "react";
import Slider from "react-slick";
import Image from "next/image";

import { GetBlogsReturnType } from "@/features/blogs/api/use-get-blogs";
import Link from "next/link";
import { useIncrementView } from "@/features/blogs/api/use-increment-view";
import { Id } from "../../../convex/_generated/dataModel";
interface BlogSliderProps {
  blogs: GetBlogsReturnType | undefined;
  isLoading: boolean | undefined;
}
const BlogSlider = ({blogs}: BlogSliderProps) => {
    const {mutate} = useIncrementView()

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  const handleClick = (blogId: Id<"blogs">) => {
    mutate({blogId})
  }
  return (
    <div className="slider-container max-w-7xl mx-auto multiple-items-slider">
      <Slider {...settings}>
        {blogs?.map((blog) => (
        <Link onClick={() => handleClick(blog._id as Id<"blogs">)} key={blog._id} href={`/blog/${blog.slug}` }>
          <div className="w-[250px] h-[370px] bg-white rounded-md">
            <div className="w-full h-[250px] relative rounded-t-md">
              <Image
                alt=""
                src={blog.posterUrl || ""}
                fill
                className="object-cover rounded-t-md"
              />
            </div>
            <div className="p-2">
              <h1 className="font-bold">
                {blog.title}
              </h1>
              {blog.views && blog.views > 0 ? (
                <p className="text-xs">
                  {blog.views} lượt xem
                </p>
              ) : (
                <p className="text-xs">
                  0 lượt xem
                </p>
              )} 
             
            </div>
          </div>
        </Link>
        ))}
      </Slider>
    </div>
  );
};

export default BlogSlider;
