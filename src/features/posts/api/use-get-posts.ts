import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

interface UseGetPostsProps {
    slug: string;
}
export type GetBlogsReturnType = typeof api.posts.getByBlogId._returnType;
export const useGetPosts = ({slug}: UseGetPostsProps) => {
    const data = useQuery(api.posts.getByBlogId, {slug});

    const isLoading = data === undefined;

    return {data, isLoading};
}