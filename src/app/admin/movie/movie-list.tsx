import { useGetMovies } from "@/features/movies/api/use-get-movies";
import { Loader, MoreHorizontal, TriangleAlert } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { useState } from "react";
import { useUpdateMovieModal } from "@/features/movies/store/use-update-movie";
import { Id } from "../../../../convex/_generated/dataModel";
import { useGetMovie } from "@/features/movies/api/use-get-movie";
import { UpdateMovieModal } from "@/features/movies/components/update-movie-modal";

export const MovieList = () => {
  const { data, isLoading } = useGetMovies();
  const [,setOpen] = useUpdateMovieModal()
  const [action, setAction] = useState("");
  const [movieId, setMovieId] = useState<Id<"movies"> | undefined>(undefined);
  const {data: movie} = useGetMovie({id: movieId as Id<"movies">})
  if (isLoading) {
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
        <TriangleAlert className="size-6  text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Không tìm thấy dữ liệu
        </span>
      </div>
    );
  }

  

  const handleUpdate = (action: string, movieId: Id<"movies">) => {
    if(action === "update"){
        setMovieId(movieId);
        setOpen(true)
        
    }
  }
  return (
    <div>
    <UpdateMovieModal movie={movie}/>
      <div className="min-h-96">
        <h1 className="font-bold text-xl p-2">Danh sách phim</h1>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ảnh phim</TableHead>
              <TableHead>Tên phim</TableHead>
              <TableHead>Đạo diễn</TableHead>
              <TableHead>Mô tả</TableHead>
              <TableHead>Thể loại</TableHead>
              <TableHead>Diễn viên</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày tạo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((movie) => {
              const date = movie._creationTime
                ? new Date(movie._creationTime)
                : null;
              const formattedDate = date
                ? date.toLocaleString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })
                : "N/A";
              return (
                <TableRow key={movie._id}>
                  <TableCell>
                    <div className="w-24 h-24 relative">
                      <Image
                        alt=""
                        src={movie.posterUrl || ""}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{movie.title}</TableCell>
                  <TableCell className="font-medium">
                    {movie.director}
                  </TableCell>
                  <TableCell className="font-medium">
                    {movie.description}
                  </TableCell>
                  <TableCell className="font-medium">
                    {movie.genre && movie.genre.join(", ")}
                  </TableCell>
                  <TableCell className="font-medium">
                    {movie.cast && movie.cast.join(", ")}
                  </TableCell>
                  <TableCell className="font-medium">{movie.status}</TableCell>
                  <TableCell>{formattedDate}</TableCell>
                  <TableCell className="font-medium">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                          <MoreHorizontal className="size-4 cursor-pointer" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Action</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuRadioGroup
                          value={action}
                          onValueChange={setAction}
                        >
                          <DropdownMenuRadioItem onClick={() => handleUpdate("update",movie._id)} value="update">
                            Update
                          </DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="delete">
                            Delete
                          </DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
