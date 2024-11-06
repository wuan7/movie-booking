import { atom, useAtom } from "jotai";
import { GetShowtimesByBranchIdAndDateReturnType } from "../api/use-get-showtimes-by-branch-and-date";

const dateState = atom<string>("");
const dateLoadingState = atom<boolean | undefined>();

const currentShowtime = atom<GetShowtimesByBranchIdAndDateReturnType | undefined>();
const currentShowtimeLoadingState = atom<boolean | undefined>();

export const useDate = () => {
    return useAtom(dateState);
};


export const useDateLoading = () => {
    return useAtom(dateLoadingState);
};

export const useCurrentShowtime = () => {
    return useAtom(currentShowtime);
}

export const useCurentShowtimeLoading = () => {
    return useAtom(currentShowtimeLoadingState);
};