import { atom, useAtom } from "jotai";

const trailerState = atom<string>();
const trailerLoadingState = atom<boolean | undefined>();


export const useTrailer = () => {
    return useAtom(trailerState);
};

export const useTrailerLoading = () => {
    return useAtom(trailerLoadingState);
};


