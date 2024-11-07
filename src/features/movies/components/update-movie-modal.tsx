"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { useUpdateMovieModal } from "../store/use-update-movie";

import { GetMovieReturnType } from "../api/use-get-movie";
import { useRef, useState } from "react";
import { useGenerateUploadUrl } from "@/features/upload/api/use-generate-upload-url";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Hint } from "@/components/hint";
import { XIcon } from "lucide-react";
import { DatePicker } from "@/components/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { toast } from "sonner";
import { Id } from "../../../../convex/_generated/dataModel";
import { useUpdateMovie } from "../api/use-update-movie";

interface UpdateMovieModalProps {
  movie: GetMovieReturnType | null | undefined;
}
type UpdateMovieValues = {
  id: Id<"movies">;
  title?: string;
  description?: string;
  director?: string;
  duration?: number;
  releaseDate?: string;
  nation?: string;
  posterUrl?: Id<"_storage"> | undefined;
  trailerUrl?: string;
  genre?: string[];
  cast?: string[];
  status?: "upcoming" | "showing" | "not_showing";
  age?: "18" | "16" | "13" | "K" | "P";
};
const genreList = [
  "Hành động",
  "Tâm lý",
  "Hài",
  "Tình cảm",
  "Kinh dị",
  "Phiêu lưu",
  "Viễn tưởng",
  "Hoạt hình",
  "Thể thao",
  "Khoa học viễn tưởng",
  "Âm nhạc",
  "Tài liệu",
  "Gia đình",
  "Chính kịch",
  "Kịch tính",
  "Hình sự",
  "Bí ẩn",
  "Phép thuật",
  "Thần thoại",
  "Lịch sử",
  "Chiến tranh",
  "Thảm họa",
  "Viễn Tây",
  "Phiêu lưu kỳ ảo",
  "Thám hiểm",
  "Trinh thám",
  "Tội phạm",
  "Học đường",
  "Cổ trang",
  "Thực tế",
  "Siêu anh hùng",
  "Giả tưởng",
  "Khác",
];

export const UpdateMovieModal = ({ movie }: UpdateMovieModalProps) => {
  const [open, setOpen] = useUpdateMovieModal();
  const [image, setImage] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [director, setDirector] = useState("");
  const [duration, setDuration] = useState(0);
  const [releaseDate, setReleaseDate] = useState<Date>();
  const [nation, setNation] = useState("");
  const [trailerUrl, setTrailerUrl] = useState("");
  const [status, setStatus] = useState<"upcoming" | "showing" | "not_showing">(
    "upcoming"
  );
  const [age, setAge] = useState<"18" | "16" | "13" | "K" | "P">("18");
  const [cast, setCast] = useState("");
  const [genres, setGenres] = useState<string[]>([]);
  const [selectedCast, setSelectedCast] = useState<string[]>([]);
  const [isPending, setIsPending] = useState(false);
  const { mutate } = useUpdateMovie();
  const { mutate: generateUploadUrl } = useGenerateUploadUrl();
  const imageElementRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setDirector("");
    setDuration(0);
    setReleaseDate(undefined);
    setNation("");
    setImage(null);
    setTrailerUrl("");
    setStatus("upcoming");
    setGenres([]);
    setSelectedCast([]);
    setCast("");
    setAge("18");
    setOpen(false);
  };
  if (!movie || "error" in movie) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="overflow-y-auto h-[80vh] p-6 max-w-5xl">
          <DialogHeader className="">
            <DialogTitle>Cập nhật phim</DialogTitle>
          </DialogHeader>
          <>
            <div>Không có dữ liệu</div>
          </>
        </DialogContent>
      </Dialog>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsPending(true);
      const values: UpdateMovieValues = {
        id: movie._id,
        title: title || "",
        description: description || "",
        director: director || "",
        duration: duration || 0,
        nation: nation || "",
        posterUrl: undefined,
        trailerUrl: trailerUrl || "",
        status: status || undefined,
        age: age || undefined,
        genre: undefined,
        cast: undefined,
      };

      if (image) {
        const url = await generateUploadUrl({}, { throwError: true });
        if (!url) {
          throw new Error("Url not found");
        }
        const result = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": image.type },
          body: image,
        });

        if (!result.ok) {
          throw new Error("Failed to upload image");
        }

        const { storageId } = await result.json();
        values.posterUrl = storageId;
      }
      if (title) {
        values.title = title;
      }
      if (description) {
        values.description = description;
      }
      if (director) {
        values.director = director;
      }
      if (duration) {
        values.duration = duration;
      }
      if (releaseDate) {
        const formattedDate = format(releaseDate, "MM/dd/yyyy");
        values.releaseDate = formattedDate;
      }
      if (nation) {
        values.nation = nation;
      }
      if (trailerUrl) {
        values.trailerUrl = trailerUrl;
      }
      if (status) {
        values.status = status;
      }
      if (age) {
        values.age = age;
      }

      if (genres && genres.length > 0) {
        values.genre = genres;
      }
      if (selectedCast && selectedCast.length > 0) {
        values.cast = selectedCast;
      }

      mutate(values, {
        onSuccess: () => {
          toast.success("Movie update successfully");
          handleClose();
          window.location.reload();
        },
        onError: (error) => {
          toast.error("Failed to update movie");
          console.log(error);
        },
      });
    } catch (error) {
      toast.error("Failed to update movie");
      console.log(error);
    } finally {
      setIsPending(false);
    }
  };
  const handleGenreClick = (genre: string) => {
    const isSelected = genres.some((g) => g === genre);
    if (isSelected) {
      setGenres(genres.filter((g) => g !== genre));
    } else {
      setGenres([...genres, genre]);
    }
  };
  const handleAddCast = () => {
    setSelectedCast([...selectedCast, cast]);
    setCast("");
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="overflow-y-auto h-[80vh] p-6 max-w-5xl">
        <DialogHeader className="">
          <DialogTitle>Cập nhật phim</DialogTitle>
        </DialogHeader>
        <>
          <div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Label htmlFor="title">Tên phim </Label>

              <Input
                id="title"
                value={movie.title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isPending}
                required
                autoFocus
                minLength={3}
                placeholder="Movie name"
              />
              <Label htmlFor="description">Mô tả phim </Label>

              <Textarea
                id="description"
                onChange={(e) => setDescription(e.target.value)}
                value={movie.description}
                placeholder="Description..."
                disabled={isPending}
              />
              <Label htmlFor="director">Tên đạo diễn </Label>

              <Input
                id="director"
                value={movie.director}
                onChange={(e) => setDirector(e.target.value)}
                disabled={isPending}
                required
                autoFocus
                minLength={3}
                placeholder="Dierector name"
              />

              <Label htmlFor="duration">Thời gian chiếu</Label>
              <Input
                id="duration"
                value={movie.duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                disabled={isPending}
                required
                autoFocus
                minLength={2}
                placeholder="Thời gian"
              />
              <Label>Ảnh</Label>

              <Input
                type="file"
                accept="image/*"
                ref={imageElementRef}
                onChange={(event) => setImage(event.target.files![0])}
                className=""
              />
              {!!image && (
                <div className="p-2">
                  <div className="relative size-[62px] flex items-center justify-center group/image">
                    <Hint label="Remove">
                      <button
                        onClick={() => {
                          setImage(null);
                          imageElementRef.current!.value = "";
                        }}
                        className="hidden group-hover/image:flex rounded-full bg-black/70 hover:bg-black absolute -top-2.5 -right-2.5 text-white size-6 z-[4] border-2 border-white items-center justify-center"
                      >
                        <XIcon className="size-3.5" />
                      </button>
                    </Hint>
                    <Image
                      src={URL.createObjectURL(image)}
                      alt="Uploaded"
                      fill
                      className="rounded-xl overflow-hidden border object-cover"
                    />
                  </div>
                </div>
              )}
              <Label>Ngày phát hành</Label>
              <br />
              <DatePicker
                date={releaseDate}
                setDate={setReleaseDate}
                disabled={isPending}
              />
              <br />
              <Label htmlFor="nation">Quốc gia</Label>

              <Input
                id="nation"
                value={movie.nation}
                onChange={(e) => setNation(e.target.value)}
                disabled={isPending}
                required
                autoFocus
                minLength={2}
                placeholder="Quốc gia"
              />
              <Label htmlFor="trailerUrl">Trialer phim</Label>
              <Input
                id="trailerUrl"
                value={movie.trailerUrl}
                onChange={(e) => setTrailerUrl(e.target.value)}
                disabled={isPending}
                required
                autoFocus
                minLength={3}
                placeholder="Trailer url"
              />

              <Label>Độ tuổi phù hợp</Label>
              <Select
                defaultValue={movie.age}
                onValueChange={(value: "18" | "16" | "13" | "K" | "P") =>
                  setAge(value)
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Age" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="18">18+</SelectItem>
                  <SelectItem value="16">16+</SelectItem>
                  <SelectItem value="13">13+</SelectItem>
                  <SelectItem value="P">Public</SelectItem>
                  <SelectItem value="K">Kid</SelectItem>
                </SelectContent>
              </Select>

              <div className="">
                <Label>Thêm diễn viên</Label>
                <div className="flex max-w-[300px]">
                  <Input
                    value={cast}
                    onChange={(e) => setCast(e.target.value)}
                    disabled={isPending}
                    autoFocus
                    placeholder="cast name"
                  />
                  <Button type="button" onClick={handleAddCast}>
                    Add cast
                  </Button>
                </div>
                <div>
                  {selectedCast.map((castName) => (
                    <p key={castName}>{castName}</p>
                  ))}
                </div>
                <div>
                  <Label>Diễn viên trước</Label>
                  {movie.cast.map((castName) => (
                    <p key={castName}>{castName}</p>
                  ))}
                </div>
              </div>
              <Label htmlFor="status">{status}</Label>
              <Select
                defaultValue={movie.status}
                onValueChange={(
                  value: "upcoming" | "showing" | "not_showing"
                ) => setStatus(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="showing">Showing</SelectItem>
                  <SelectItem value="not_showing">Not showing</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center flex-wrap gap-2 my-2  pb-2">
                {genreList.map((genre, i) => (
                  <Button
                    onClick={() => handleGenreClick(genre)}
                    type="button"
                    key={i}
                    variant="ghost"
                    size="sm"
                    className="bg-blue-500 text-white"
                  >
                    {genre}
                  </Button>
                ))}
              </div>
              {genres && (
                <div className="flex gap-2 mb-2">
                  {genres.map((genre, i) => (
                    <div
                      key={i}
                      className="bg-slate-400 p-1 text-xs rounded-md"
                    >
                      {genre}
                    </div>
                  ))}
                </div>
              )}
              {genres && (
                <div className="flex gap-2 mb-2">
                  <Label>Thể loại trước</Label>
                  {movie.genre.map((genre, i) => (
                    <div
                      key={i}
                      className="bg-slate-400 p-1 text-xs rounded-md"
                    >
                      {genre}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-x-2">
                <Button
                  disabled={isPending}
                  type="button"
                  onClick={handleClose}
                >
                  Hủy
                </Button>
                <Button disabled={isPending}>Cập nhật</Button>
              </div>
            </form>
          </div>
        </>
      </DialogContent>
    </Dialog>
  );
};
