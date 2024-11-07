import { atom, useAtom } from "jotai";

const modalState = atom(false);

export const useUpdateMovieModal = () => {
    return useAtom(modalState);
}