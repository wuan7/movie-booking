import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateBanner } from "@/features/banners/api/use-create-banner";
import { useGenerateUploadUrl } from "@/features/upload/api/use-generate-upload-url";
import { TriangleAlert, XIcon } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import { toast } from "sonner";
import { useGetMovies } from "@/features/movies/api/use-get-movies";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
type CreateBannerValues = {
  title: string;
  description?: string;
  posterUrl?: Id<"_storage">;
  link?: string;
  isPublished: boolean;
  publishedAt?: number;
};
export const AddBanner = () => {
  const { data: movies, isLoading: moviesLoading } = useGetMovies();
  const [image, setImage] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const { mutate } = useCreateBanner();
  const { mutate: generateUploadUrl } = useGenerateUploadUrl();
  const imageElementRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setLink("");
    setImage(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (!title || !description) return;
      setIsPending(true);
      const values: CreateBannerValues = {
        title,
        description,
        link,
        posterUrl: undefined,
        isPublished,
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

      mutate(values, {
        onSuccess: () => {
          toast.success("Banner created successfully");
          handleClose();
        },
        onError: (error) => {
          toast.error("Failed to create banner");
          console.log(error);
        },
      });
    } catch (error) {
      toast.error("Failed to create banner");
      console.log(error);
    } finally {
      setIsPending(false);
    }
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
          placeholder="blog name"
        />
        <Textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          placeholder="content..."
          disabled={isPending}
        />

        <div className="flex">
          <p>isPublished:</p>
          <Button
            className=""
            onClick={() => setIsPublished(!isPublished)}
            type="button"
          >
            {isPublished ? "true" : "false"}
          </Button>
        </div>
        <div className="">
          <Select
            onValueChange={(value: string) => setLink(value)}
            required
            disabled={isPending}
          >
            <SelectTrigger className="md:w-[380px] w-full">
              <SelectValue placeholder="Select movie" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {moviesLoading ? (
                  <>
                    <div className="flex flex-col gap-y-2 ">
                      <div className="flex items-center gap-x-3">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-8 w-[250px]" />
                        </div>
                      </div>
                      <div className="flex items-center gap-x-3">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-8 w-[250px]" />
                        </div>
                      </div>
                      <div className="flex items-center gap-x-3">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-8 w-[250px]" />
                        </div>
                      </div>
                      <div className="flex items-center gap-x-3">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-8 w-[250px]" />
                        </div>
                      </div>
                      <div className="flex items-center gap-x-3">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-8 w-[250px]" />
                        </div>
                      </div>
                    </div>
                  </>
                ) : !movies ? (
                  <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
                    <TriangleAlert className="size-6  text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      No movie found
                    </span>
                  </div>
                ) : (
                  <>
                    {movies.map((movie) => (
                      <SelectItem key={movie._id} value={movie._id}>
                        <div className="flex items-center">
                          <Avatar className="size-10 hover:opacity-75 transition mr-2">
                            <AvatarImage src={movie.posterUrl || ""} />
                            <AvatarFallback>
                              {movie.title.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <p className="font-semibold">{movie.title}</p>
                        </div>
                      </SelectItem>
                    ))}
                  </>
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <Input value={link} disabled={isPending} autoFocus placeholder="link" />
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

        <div className="">
          <Button type="submit" disabled={isPending}>
            Create
          </Button>
        </div>
      </form>
    </div>
  );
};
