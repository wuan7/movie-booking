import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

import Image from "next/image";
import slugify from 'slugify';
import { Id } from "../../../../convex/_generated/dataModel";
import { TriangleAlert, XIcon } from "lucide-react";
import { Hint } from "@/components/hint";
import { useGenerateUploadUrl } from "@/features/upload/api/use-generate-upload-url";
import { useCreateBlog } from "@/features/blogs/api/use-create-blog";
import { useGetCategories } from "@/features/categories/api/use-get-categories";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
type CreateBlogValues = {
  title: string;
  slug: string;
  content: string;
  author?: string;
  readTime?: number;
  tags?: string[];
  categoryId: Id<"categories">;
  metaTitle?: string;
  metaDescription?: string;
  posterUrl?: Id<"_storage"> | undefined;
  isPublished: boolean;
};

const createSlug = (title: string) => {
  const id = Math.random().toString(36).slice(2, 10);
  return slugify(title, {
    lower: true,
    strict: false,
    locale: 'vi',
    replacement: '-'
  }) + `-${id}`;
};

export const AddBlog = () => {
  const [image, setImage] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [readTime, setReadTime] = useState(3);
  const [categoryId, setCategoryId] = useState<Id<"categories">>();
  const [isPending, setIsPending] = useState(false);
  const { mutate } = useCreateBlog();
  const { mutate: generateUploadUrl } = useGenerateUploadUrl();
  const { data, isLoading } = useGetCategories();
  const imageElementRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    setTitle("");
    setContent("");
    setReadTime(0);
    setMetaDescription("");
    setImage(null);
    setMetaTitle("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (!title || !content || !categoryId || !metaTitle) return;
      setIsPending(true);
      const slug = createSlug(title);
      const values: CreateBlogValues = {
        title,
        slug,
        content,
        readTime,
        metaTitle,
        metaDescription,
        categoryId: categoryId as Id<"categories">,
        posterUrl: undefined,
        isPublished: true,
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
          toast.success("Blog created successfully");
          handleClose();
        },
        onError: (error) => {
          toast.error("Failed to create blog");
          console.log(error);
        },
      });
    } catch (error) {
      toast.error("Failed to create blog");
      console.log(error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div>
      <p>Add blog</p>
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
          onChange={(e) => setContent(e.target.value)}
          value={content}
          placeholder="content..."
          disabled={isPending}
        />

        <Input
          value={metaTitle}
          onChange={(e) => setMetaTitle(e.target.value)}
          disabled={isPending}
          required
          autoFocus
          minLength={3}
          placeholder="metaTitle"
        />
        <Input
          value={metaDescription}
          onChange={(e) => setMetaDescription(e.target.value)}
          disabled={isPending}
          autoFocus
          placeholder="metaTitle description"
        />
        <Input
          value={readTime}
          onChange={(e) => setReadTime(Number(e.target.value))}
          disabled={isPending}
          autoFocus
          minLength={1}
          placeholder="Thời gian đọc"
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
        <div className="">
          <Select
            onValueChange={(value: Id<"categories">) => setCategoryId(value)}
            required
            disabled={isPending}
          >
            <SelectTrigger className="md:w-[380px] w-full">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {isLoading ? (
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
                ) : !data ? (
                  <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
                    <TriangleAlert className="size-6  text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      No category found
                    </span>
                  </div>
                ) : (
                  <>
                    {data.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        <div className="flex items-center">
                          <p className="font-semibold">{category.name}</p>
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
          <Button type="submit" disabled={isPending}>
            Create
          </Button>
        </div>
      </form>
    </div>
  );
};
