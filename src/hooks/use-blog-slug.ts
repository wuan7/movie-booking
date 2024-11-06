import { useParams } from "next/navigation";

export const useBlogSlug = () => {
    const params = useParams();
    return params.blogId as string;
}