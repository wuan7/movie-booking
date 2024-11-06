import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMovieTrailerModal } from "../store/use-movie-trailer-model";
import { useEffect, useState } from "react";
import { useTrailer } from "../store/use-trailer";


export const MovieTrailerModal = () => {
  const [open, setOpen] = useMovieTrailerModal();
  const [trailer] = useTrailer();
  const [trailerUrl, setTrailerUrl] = useState("");
  useEffect(() => {
    if (trailer) {
      setTrailerUrl(trailer);
    }
  }, [trailer]);
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="overflow-y-auto h-[80vh] p-6 max-w-5xl bg-gradient-to-b   from-[#0F172A] to-[#131d36] text-white">
        <DialogHeader className="">
          <DialogTitle>Trailer</DialogTitle>
        </DialogHeader>

        <>
          <div>
            <iframe
              className="w-full "
              width="560"
              height="415"
              src={trailerUrl}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        </>
      </DialogContent>
    </Dialog>
  );
};
