
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";

import { Id } from "../../../../convex/_generated/dataModel";
import { XIcon } from "lucide-react";
import { Hint } from "@/components/hint";
import { useGenerateUploadUrl } from "@/features/upload/api/use-generate-upload-url";
import { useCreateCompany } from "@/features/companies/api/use-create-company";
import { Label } from "@/components/ui/label";
type CreateCompanyValues = {
  name: string;
  logoUrl?: Id<"_storage"> | undefined;
  posterUrl?: Id<"_storage"> | undefined;
  description?: string;
  storesNumber?: number;
};

export const AddCompany = () => {
  const [image, setImage] = useState<File | null>(null);
  const [posterImage, setPosterImage] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [storesNumber, setStoresNumber] = useState(0);

  const [isPending, setIsPending] = useState(false);
  const { mutate } = useCreateCompany();
  const { mutate: generateUploadUrl } = useGenerateUploadUrl();
  const imageElementRef = useRef<HTMLInputElement>(null);
  const posterImageElementRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    setName("");
    setDescription("");
    setStoresNumber(0);
    setImage(null);
    setPosterImage(null);
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsPending(true);
      const values: CreateCompanyValues = {
        name,
        description,
        logoUrl: undefined,
        posterUrl: undefined,
        storesNumber,
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
        values.logoUrl = storageId;
      }

      if (posterImage) {
        const url = await generateUploadUrl({}, { throwError: true });
        if (!url) {
          throw new Error("Url not found");
        }
        const result = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": posterImage.type },
          body: posterImage,
        });

        if (!result.ok) {
          throw new Error("Failed to upload image");
        }

        const { storageId } = await result.json();
        values.posterUrl = storageId;
      }

      mutate(values, {
        onSuccess: () => {
          toast.success("Company created successfully");
          handleClose();
        },
        onError: (error) => {
          toast.error("Failed to create Company");
          console.log(error);
        },
      });
    } catch (error) {
      toast.error("Failed to create Company");
      console.log(error);
    } finally {
      setIsPending(false);
    }
  };
  return (
    <div>
      <h1 className="font-bold">Thêm Công ty</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Label htmlFor="company">Tên công ty</Label>
        <Input
          value={name}
          id="company"
          onChange={(e) => setName(e.target.value)}
          disabled={isPending}
          required
          autoFocus
          minLength={3}
          placeholder="company name"
        />
        <Label htmlFor="Description">Mô tả</Label>

        <Textarea
          id="Description"
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          placeholder="Description..."
          disabled={isPending}
        />
        <Label htmlFor="storesNumber">Số cửa hàng</Label>
        <Input
          id="storesNumber"
          value={storesNumber}
          onChange={(e) => setStoresNumber(Number(e.target.value))}
          disabled={isPending}
          required
          autoFocus
          minLength={1}
          placeholder="20 stores"
        />
        <Label htmlFor="image">Image</Label>

        <Input
          id="image"
          type="file"
          accept="image/*"
          ref={imageElementRef}
          onChange={(event) => setImage(event.target.files![0])}
          className=""
          placeholder="Image"
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
        <Label htmlFor="poster">Poster image</Label>
        <Input
          id="poster"
          type="file"
          accept="image/*"
          ref={posterImageElementRef}
          onChange={(event) => setPosterImage(event.target.files![0])}
          className=""
          placeholder="Poster"
        />
        {!!posterImage && (
          <div className="p-2">
            <div className="relative size-[62px] flex items-center justify-center group/image">
              <Hint label="Remove">
                <button
                  onClick={() => {
                    setPosterImage(null);
                    posterImageElementRef.current!.value = "";
                  }}
                  className="hidden group-hover/image:flex rounded-full bg-black/70 hover:bg-black absolute -top-2.5 -right-2.5 text-white size-6 z-[4] border-2 border-white items-center justify-center"
                >
                  <XIcon className="size-3.5" />
                </button>
              </Hint>
              <Image
                src={URL.createObjectURL(posterImage)}
                alt="Uploaded"
                fill
                className="rounded-xl overflow-hidden border object-cover"
              />
            </div>
          </div>
        )}

        <div className="">
          <Button disabled={isPending}>Create</Button>
        </div>
      </form>
    </div>
  );
};
