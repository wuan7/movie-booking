import { GetBlogsReturnType } from "@/features/blogs/api/use-get-blogs";
import { useIncrementView } from "@/features/blogs/api/use-increment-view";
import Link from "next/link";
import { Id } from "../../convex/_generated/dataModel";
import Image from "next/image";
import { ArrowDown, Loader } from "lucide-react";
interface BlogSliderProps {
  loadMore: () => void;
  isLoadingMore: boolean;
  canLoadMore: boolean;
  blogs: GetBlogsReturnType | undefined;
  isLoading: boolean | undefined;
}

export const BlogList = ({
  blogs,
  isLoadingMore,
  canLoadMore,
  loadMore,
}: BlogSliderProps) => {
  const { mutate } = useIncrementView();

  const handleClick = (blogId: Id<"blogs">) => {
    mutate({ blogId });
  };
  return (
    <>
      <div>
        <h1
          className="text-white font-bold text-3xl py-5 text-center "
          style={{
            textShadow:
              "0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.6), 0 0 30px rgba(255, 255, 255, 0.4)",
          }}
        >
          Blog phim
        </h1>
      </div>
      <div className="md:grid md:grid-cols-4 gap-5 grid-cols-1 flex flex-col items-center">
        {blogs?.map((blog) => (
          <Link
            onClick={() => handleClick(blog._id as Id<"blogs">)}
            key={blog._id}
            href={`/blog/${blog.slug}`}
          >
            <div className="max-w-[350px]  bg-white rounded-md">
              <div className="w-full h-[250px] relative rounded-t-md">
                <Image
                  alt=""
                  src={blog.posterUrl || ""}
                  fill
                  className="object-cover rounded-t-md"
                />
              </div>
              <div className="p-2">
                <h1 className="font-bold line-clamp-2">{blog.title}</h1>
                {blog.views && blog.views > 0 ? (
                  <p className="text-xs">{blog.views} lượt xem</p>
                ) : (
                  <p className="text-xs">0 lượt xem</p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
      {isLoadingMore && (
        <div className="flex justify-center mt-4">
          <Loader className="text-white size-4 animate-spin" />
        </div>
      )}
      {canLoadMore && (
        <div className="flex justify-center mt-4">
          <button
            onClick={loadMore}
            disabled={isLoadingMore}
            className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center gap-x-2"
          >
            <ArrowDown className="size-4 animate-bounce" />
            <p>Xem thêm</p>
          </button>
        </div>
      )}
    </>
  );
};
