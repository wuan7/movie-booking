"use client";
import { useGetBlog } from "@/features/blogs/api/use-get-blog";
import { useBlogSlug } from "@/hooks/use-blog-slug";
import { Eye, Loader, TriangleAlert } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import StickyBox from "react-sticky-box";
import { useGetPosts } from "@/features/posts/api/use-get-posts";

const BlogIdPage = () => {
  const slug = useBlogSlug();
  const { data: blog, isLoading: isBlogLoading } = useGetBlog({ slug });
  const { data: posts } = useGetPosts({ slug });
  const [activeId, setActiveId] = useState<string | null>(null);
  const [title, setTitle] = useState<string | null>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const targetElement = entry.target as HTMLElement;
            setActiveId(targetElement.id);
            setTitle(targetElement.getAttribute("title") || null);
          }
        });
      },
      { threshold: 0.5 }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      sectionRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [posts]);

  if (isBlogLoading) {
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!blog || "error" in blog) {
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
        <TriangleAlert className="size-6  text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Không tìm thấy blog
        </span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto ">
      <div className="md:mt-[150px] mt-[90px]"></div>
      <div className="w-full relative h-80">
        <Image
          alt=""
          src={blog.posterUrl || ""}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex md:flex-row flex-col w-full items-start gap-x-1">
        <div className="md:w-2/3">
          <div>
            <div className="flex gap-x-2 items-center p-3">
              <span className="text-sm">{blog.readTime} phút đọc</span>
              <Eye className="size-4" />
              <span className="text-sm">{blog.views}</span>
            </div>
            <div className="p-3">
              <h1 className="text-3xl font-bold">{blog.title}</h1>
              <p>{blog.content}</p>
            </div>

            <StickyBox
              offsetTop={66}
              offsetBottom={10}
              className="flex md:hidden z-10"
            >
              <div className="shadow-md bg-white p-2 w-full font-bold">
                {title}
              </div>
            </StickyBox>
            {posts?.map((post, index) => (
              <div
                key={post._id}
                id={post._id}
                title={post.title}
                ref={(el) => {
                  sectionRefs.current[index] = el;
                }}
                className="p-3"
              >
                <h1 className="text-2xl font-bold">{post.title}</h1>
                <div
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
                {post.posterUrl && (
                  <div className="w-full relative h-72">
                    <Image
                      alt=""
                      src={post.posterUrl}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <StickyBox
          offsetTop={115}
          offsetBottom={10}
          className="md:w-1/3  hidden md:flex"
        >
          <div className="  w-full">
            <h3>Mục lục</h3>
            <ul className="">
              {posts?.map((post) => (
                <li
                  key={post._id}
                  className={`p-3 border-l-2 ${
                    activeId === post._id
                      ? "border-l-red-600 font-bold text-blue-500"
                      : ""
                  }`}
                >
                  {" "}
                  {post.title}
                </li>
              ))}
            </ul>
          </div>
        </StickyBox>
      </div>
      <div className="h-5"></div>
    </div>
  );
};

export default BlogIdPage;
