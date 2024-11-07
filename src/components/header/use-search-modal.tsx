import { atom, useAtom } from "jotai";

const modalState = atom(false);

export const useSearchModal = () => {
    return useAtom(modalState);
}