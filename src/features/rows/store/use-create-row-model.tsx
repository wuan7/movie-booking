import { atom, useAtom } from "jotai";

const modalState = atom(false);

export const useCreateRowModal = () => {
    return useAtom(modalState);
}