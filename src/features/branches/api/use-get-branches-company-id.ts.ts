import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface UseGetBranchesCompanyIdProps {
    cinemaCompanyId?:Id<"cinemaCompanies">;
}

export type GetBranchesCompanyIdReturnType = typeof api.branches.getByCompanyId._returnType;
export const useGetBranchesCompanyId = ( {cinemaCompanyId} : UseGetBranchesCompanyIdProps) => {
    const data = useQuery(api.branches.getByCompanyId, {cinemaCompanyId});

    const isLoading = data === undefined;

    return {data, isLoading};
}