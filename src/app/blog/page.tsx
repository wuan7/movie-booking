"use client";

import { useGetBlogs } from "@/features/blogs/api/use-get-blogs";
import { useIncrementView } from "@/features/blogs/api/use-increment-view";
import Image from "next/image";
import Link from "next/link";
import { Id } from "../../../convex/_generated/dataModel";
import { ArrowDown, Loader } from "lucide-react";

const BlogPage = () => {
  const { results, status, loadMore, isLoading } = useGetBlogs();
  const { mutate } = useIncrementView();
  const handleClick = (blogId: Id<"blogs">) => {
    mutate({ blogId });
  };
  if(status === "LoadingFirstPage") {
    return (
      <div className="flex justify-center mt-4 items-center min-h-96">
        <Loader className=" size-4 animate-spin"/>
      </div>
    )
  }
  if(!results || results.length === 0) {
    return (
      <div className="flex justify-center mt-4 items-center min-h-96">
        <p className="text-slate-600 text-2xl font-bold">Không tìm thấy blog</p>
      </div>
    )
  }
  return (
    <div className="max-w-6xl mx-auto p-2">
      <h1 className="font-bold text-2xl">Blog Phim</h1>
      <h3>
        Cập nhật các Blog về phim ảnh hay nhất trên thị trường với đầy đủ thể
        loại, quốc gia. Giải mã những nội dung phim gây tò mò và hấp dẫn.
      </h3>
      <div>
        {results &&
          results.map((blog) => (
            <Link
              onClick={() => handleClick(blog._id as Id<"blogs">)}
              key={blog._id}
              href={`/blog/${blog.slug}`}
            >
              <div className="w-full  flex md:flex-row flex-col gap-x-2 my-2">
                <div className="md:w-1/3 w-full relative  h-40">
                  <Image
                    alt=""
                    src={blog.posterUrl || ""}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="md:w-2/3 w-full">
                  <h1 className="font-bold text-xl">{blog.title}</h1>
                  <p className="text-blue-600 text-xs">{blog.category?.name}</p>
                  <p className="text-slate-600">{blog.content}</p>
                </div>
              </div>
            </Link>
          ))}
      </div>
      {status === "LoadingMore" && (
      <div className="flex justify-center mt-4">
        <Loader className=" size-4 animate-spin"/>
      </div>
    )}
    {status === "CanLoadMore" && (
      <div className="flex justify-center mt-4">
        <button
          onClick={loadMore}
          disabled={isLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center gap-x-2"
        >
            <ArrowDown className="size-4 animate-bounce"/>
            <p>Xem thêm</p>
          
        </button>
      </div>
    )}
    </div>
  );
};

export default BlogPage;
