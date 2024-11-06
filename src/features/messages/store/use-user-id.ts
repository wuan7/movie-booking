import { useQueryState } from "nuqs";

export const useUserId = () => {
    return useQueryState("userId");
}
