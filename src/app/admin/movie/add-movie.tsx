import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useCreateMovie } from "@/features/movies/api/use-create-movie";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/date-picker";
import { format } from "date-fns";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Id } from "../../../../convex/_generated/dataModel";
import { XIcon } from "lucide-react";
import { Hint } from "@/components/hint";
import { useGenerateUploadUrl } from "@/features/upload/api/use-generate-upload-url";

type CreateMovieValues = {
  title: string;
  description: string;
  director: string;
  duration: number;
  releaseDate: string;
  nation: string;
  posterUrl?: Id<"_storage"> | undefined;
  trailerUrl: string;
  genre: string[];
  cast: string[];
  status: "upcoming" | "showing" | "not_showing";
  age: "18" | "16" | "13" | "K" | "P";
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
  "Phiêu lưu",
  "Khoa học viễn tưởng",
  "Âm nhạc",
  "Tài liệu",
  "Gia đình",
  "Chính kịch",
  "Khác",
];

export const AddMovie = () => {
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
  const { mutate } = useCreateMovie();
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
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!releaseDate) return;
    const formattedDate = format(releaseDate, "MM/dd/yyyy");
    try {
      setIsPending(true);
      const values: CreateMovieValues = {
        title,
        description,
        director,
        duration,
        releaseDate: formattedDate,
        nation,
        posterUrl: undefined,
        trailerUrl,
        status,
        age,
        genre: [],
        cast: [],
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
      if (genres) {
        values.genre = genres;
      }
      if (selectedCast) {
        values.cast = selectedCast;
      }
      mutate(values, {
        onSuccess: () => {
          toast.success("Movie created successfully");
          handleClose();
        },
        onError: (error) => {
          toast.error("Failed to create movie");
          console.log(error);
        },
      });
    } catch (error) {
      toast.error("Failed to create movie");
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
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isPending}
          required
          autoFocus
          minLength={3}
          placeholder="Movie name"
        />
        <Textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          placeholder="Description..."
          disabled={isPending}
        />

        <Input
          value={director}
          onChange={(e) => setDirector(e.target.value)}
          disabled={isPending}
          required
          autoFocus
          minLength={3}
          placeholder="Dierector name"
        />
        <Input
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          disabled={isPending}
          required
          autoFocus
          minLength={2}
          placeholder="Thời gian"
        />
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
        <DatePicker
          date={releaseDate}
          setDate={setReleaseDate}
          disabled={isPending}
        />
        <Input
          value={nation}
          onChange={(e) => setNation(e.target.value)}
          disabled={isPending}
          required
          autoFocus
          minLength={2}
          placeholder="Quốc gia"
        />

        <Input
          value={trailerUrl}
          onChange={(e) => setTrailerUrl(e.target.value)}
          disabled={isPending}
          required
          autoFocus
          minLength={3}
          placeholder="Trailer url"
        />
        <Select
          defaultValue={age}
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
        </div>

        <Select
          defaultValue={status}
          onValueChange={(value: "upcoming" | "showing" | "not_showing") =>
            setStatus(value)
          }
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
              <div key={i} className="bg-slate-400 p-1 text-xs rounded-md">
                {genre}
              </div>
            ))}
          </div>
        )}

        <div className="">
          <Button disabled={isPending}>Create</Button>
        </div>
      </form>
    </div>
  );
};
