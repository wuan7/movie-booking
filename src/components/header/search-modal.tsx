import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useGetMovies } from "@/features/movies/api/use-get-movies";
import { useSearchModal } from "./use-search-modal";
import Image from "next/image";
import Link from "next/link";
import { Loader } from "lucide-react";
export const SearchModal = () => {
  const { data, isLoading } = useGetMovies();
  const [open, setOpen] = useSearchModal();
  const handleClose = () => {
    setOpen(false);
  };
  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="overflow-y-auto h-[80vh] p-6 max-w-5xl">
          <DialogHeader className="">
            <DialogTitle>Tìm kiếm phim</DialogTitle>
          </DialogHeader>
          <>
            <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
              <Loader className="size-6 animate-spin text-muted-foreground" />
            </div>
          </>
        </DialogContent>
      </Dialog>
    );
  }
  if (!data) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="overflow-y-auto h-[80vh] p-6 max-w-5xl">
          <DialogHeader className="">
            <DialogTitle>Tìm kiếm phim</DialogTitle>
          </DialogHeader>

          <>
            <div>Không có dữ liệu</div>
          </>
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <div>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="overflow-y-auto h-[80vh] p-6 max-w-5xl">
          <DialogHeader className="">
            <DialogTitle className="text-sm">Tìm kiếm phim</DialogTitle>
          </DialogHeader>

          <>
            <div>
              <Command>
                <CommandInput placeholder="Tìm phim..." />
                <CommandList>
                  <CommandEmpty>
                    <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
                      <Image
                        src="/not-found.svg"
                        alt="logo"
                        width={100}
                        height={100}
                      />

                      <p className="text-sm ">Không tìm thấy phim.</p>
                      <span className="text-xs">
                        Bạn hãy thử tìm phim khác nhé
                      </span>
                    </div>
                  </CommandEmpty>
                  <CommandGroup>
                    {data.map((movie) => (
                      <CommandItem key={movie._id} value={movie.title}>
                        <Link
                          className="flex gap-x-2 w-full"
                          href={`/movie/${movie._id}`}
                          onClick={handleClose}
                        >
                          <div className="w-16 h-16 rounded-md relative ">
                            <Image
                              alt=""
                              src={movie.posterUrl || ""}
                              fill
                              className="rounded-md"
                            />
                          </div>
                          <div className="">
                            <p>{movie.title}</p>
                            <p className="text-xs">
                              {movie.status === "upcoming"
                                ? "Phim sắp chiếu"
                                : "Phim đang chiếu"}
                            </p>
                          </div>
                        </Link>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </div>
          </>
        </DialogContent>
      </Dialog>
    </div>
  );
};
