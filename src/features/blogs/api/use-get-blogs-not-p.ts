import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";


export type GetBlogReturnType = typeof api.blogs.getNotP._returnType;
export const useGetBlogsNotP = () => {
    const data = useQuery(api.blogs.getNotP,);

    const isLoading = data === undefined;

    return {data, isLoading};
}