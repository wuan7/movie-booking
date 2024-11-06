import { atom, useAtom } from "jotai";

const modalState = atom(false);

export const useCreateShowtimeModal = () => {
    return useAtom(modalState);
}