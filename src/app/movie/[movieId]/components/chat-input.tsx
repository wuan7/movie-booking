import Editor from "@/components/editor";
import { useGenerateUploadUrl } from "@/features/upload/api/use-generate-upload-url";
import { useState } from "react";
import { toast } from "sonner";
import { useCreateMessage } from "@/features/messages/api/use-create-message";
import { Id } from "../../../../../convex/_generated/dataModel";
import { useMovieId } from "@/hooks/use-movie-id";

type CreateMesageValues = {
  movieId: Id<"movies">;
  text: string;
  image?: Id<"_storage"> | undefined;
  rating: string;
  tags?: string[] | undefined;
};
export const ChatInput = () => {
  const movieId = useMovieId();
  console.log("movieId", movieId);
  const [isPending, setIsPending] = useState(false);
  const { mutate: generateUploadUrl } = useGenerateUploadUrl();
  const { mutate: createMessage } = useCreateMessage();
  const handleSubmit = async ({
    image,
    text,
    setText,
    setImage,
    rating,
    tags,
  }: {
    text: string;
    image: File | null;
    setText: (text: string) => void;
    setImage: (image: File | null) => void;
    rating: string;
    tags: string[] | undefined;
  }) => {
    try {
      setIsPending(true);
      const values: CreateMesageValues = {
        movieId,
        text,
        image: undefined,
        rating,
        tags: undefined,
      };
      if (!text || !rating || !movieId) {
        toast.warning("Please enter all fields");
        return;
      }
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
        values.image = storageId;
      }
      if (tags && tags.length > 0) {
        values.tags = tags;
      }
      createMessage(values, {
        onSuccess: () => {
          toast.success("Send comment successfully");
          setText("");
          setImage(null);
        },
        onError: (error) => {
          toast.error("Failed to send message idaa");
          console.log(error);
        },
      });
    } catch (error) {
      console.log(error);
      toast.error("Failed to send message");
    } finally {
      setIsPending(false);
    }
  };
  return (
    <Editor
      variant="create"
      onSubmit={handleSubmit}
      disabled={isPending}
      isParentMessage={true}
    />
  );
};
