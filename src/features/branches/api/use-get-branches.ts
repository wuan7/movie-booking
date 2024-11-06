import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";



export type GetBranchesReturnType = typeof api.branches.get._returnType;
export const useGetBranches = () => {
    const data = useQuery(api.branches.get);

    const isLoading = data === undefined;

    return {data, isLoading};
}