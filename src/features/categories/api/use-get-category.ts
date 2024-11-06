import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface UseGetCategoryProps {
    id: Id<"categories">;
}
export type GetCategoryReturnType = typeof api.categories.getById._returnType;
export const useGetCategory = ({id} : UseGetCategoryProps) => {
    const data = useQuery(api.categories.getById, { id });

    const isLoading = data === undefined;

    return {data, isLoading};
}