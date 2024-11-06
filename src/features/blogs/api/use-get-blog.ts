import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

interface UseGetBlogProps {
    slug: string;
}
export type GetBlogReturnType = typeof api.blogs.getById._returnType;
export const useGetBlog = ({slug} : UseGetBlogProps) => {
    const data = useQuery(api.blogs.getById, { slug });

    const isLoading = data === undefined;

    return {data, isLoading};
}