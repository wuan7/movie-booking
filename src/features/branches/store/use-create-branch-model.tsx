import { atom, useAtom } from "jotai";

const modalState = atom(false);

export const useCreateBranchModal = () => {
    return useAtom(modalState);
}