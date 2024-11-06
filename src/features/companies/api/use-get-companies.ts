import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";


export type GetCompaniesReturnType = typeof api.companies.get._returnType;
export const useGetCompanies = () => {
    const data = useQuery(api.companies.get);

    const isLoading = data === undefined;

    return {data, isLoading};
}