import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";


export type GetCategoriesReturnType = typeof api.categories.get._returnType;
export const useGetCategories = () => {
    const data = useQuery(api.categories.get);

    const isLoading = data === undefined;

    return {data, isLoading};
}