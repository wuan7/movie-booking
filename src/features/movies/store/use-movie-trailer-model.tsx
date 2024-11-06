import { atom, useAtom } from "jotai";

const modalState = atom(false);

export const useMovieTrailerModal = () => {
    return useAtom(modalState);
}