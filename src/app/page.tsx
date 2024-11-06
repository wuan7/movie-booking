"use client";
import { LayoutMovie } from "@/components/movie/layout-movie";
import HomeSlider from "../components/carousel/home-slider";
import { BlogList } from "@/components/blog-list";
import { useGetBlogs } from "@/features/blogs/api/use-get-blogs";
export default function Home() {
  const { results, status, loadMore, isLoading } = useGetBlogs();
  return (
    <>
      <div className=" bg-gradient-to-b   from-[#0F172A] to-[#131d36]">
        <HomeSlider />
      </div>
      <LayoutMovie />

      <div className="w-full bg-[#cf256f] py-4">
        <div className="max-w-7xl mx-auto ">
          <BlogList
            blogs={results}
            isLoading={isLoading}
            loadMore={loadMore}
            isLoadingMore={status === "LoadingMore"}
            canLoadMore={status === "CanLoadMore"}
          />
        </div>
      </div>
    </>
  );
}
