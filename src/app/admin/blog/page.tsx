"use client";
import { AddBlog } from "./add-blog";
import { AddPost } from "./add-post";
const BlogPage = () => {
  return (
    <div>
      <h1>BlogPage</h1>
      <AddBlog />
      <AddPost />
    </div>
  );
};
export default BlogPage;
