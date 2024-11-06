import { atom, useAtom } from "jotai";
import { GetRowReturnType } from "@/features/rows/api/use-get-rows"; 

const rowsState = atom<GetRowReturnType>();
const rowsLoadingState = atom<boolean | undefined>();

const seatsState = atom([]);

export const useRows = () => {
    return useAtom(rowsState);
};

export const useRowsLoading = () => {
    return useAtom(rowsLoadingState);
};

export const useSeats = () => {
    return useAtom(seatsState);
};
