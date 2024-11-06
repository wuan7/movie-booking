import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useRef, useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import { TriangleAlert, XIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCreateBlogPost } from "@/features/posts/api/use-create-blog-post";

import { useGenerateUploadUrl } from "@/features/upload/api/use-generate-upload-url";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Hint } from "@/components/hint";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import TextEditor from "../components/text-editor";
import { useGetBlogsNotP } from "@/features/blogs/api/use-get-blogs-not-p";
type CreatePostValues = {
  slug: string;
  title: string;
  content: string;
  posterUrl?: Id<"_storage"> | undefined;
};
export const AddPost = () => {
  const [isPending, setIsPending] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState<string>();
  const { data: blogs, isLoading: blogsLoading } = useGetBlogsNotP();
  const { mutate } = useCreateBlogPost();
  const { mutate: generateUploadUrl } = useGenerateUploadUrl();

  const imageElementRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    setTitle("");
    setContent("");
    setImage(null);
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsPending(true);
      const values: CreatePostValues = {
        slug: slug as string,
        content,
        title,
        posterUrl: undefined,
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
          toast.success("post created successfully");
          handleClose();
        },
        onError: (error) => {
          toast.error("Failed to create post");
          console.log(error);
        },
      });
    } catch (error) {
      toast.error("Failed to create post");
      console.log(error);
    } finally {
      setIsPending(false);
    }
  };
  return (
    <div>
      <h1>Add Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isPending}
          required
          autoFocus
          minLength={3}
          placeholder="Title"
        />
       <TextEditor content={content} setContent={setContent}/>
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
          <Select
            onValueChange={(value: string) => setSlug(value)}
            required
            disabled={isPending}
          >
            <SelectTrigger className="md:w-[380px] w-full">
              <SelectValue placeholder="Select blog" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {blogsLoading ? (
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
                ) : !blogs ? (
                  <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
                    <TriangleAlert className="size-6  text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      No blog found
                    </span>
                  </div>
                ) : (
                  <>
                    {blogs.map((blog) => (
                      <SelectItem key={blog.slug} value={blog.slug}>
                        <div className="flex items-center">
                          <Avatar className="size-10 hover:opacity-75 transition mr-2">
                            <AvatarImage src={blog.posterUrl || ""} />
                            <AvatarFallback>
                              {blog.title.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <p className="font-semibold">{blog.title}</p>
                        </div>
                      </SelectItem>
                    ))}
                  </>
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="">
          <Button disabled={isPending}>Create</Button>
        </div>
      </form>
    </div>
  );
};
