import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { useCreateCategory } from "@/features/categories/api/use-create-category";
type CreateCategoryValues = {
  name: string;
};

export const AddCategory = () => {
  const [name, setName] = useState("");
  const [isPending, setIsPending] = useState(false);
  const { mutate } = useCreateCategory();
  const handleClose = () => {
    setName("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (!name) return;
      setIsPending(true);
      const values: CreateCategoryValues = {
        name,
      };

      mutate(values, {
        onSuccess: () => {
          toast.success("Category created successfully");
          handleClose();
        },
        onError: (error) => {
          toast.error("Failed to create category");
          console.log(error);
        },
      });
    } catch (error) {
      toast.error("Failed to create category");
      console.log(error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div>
      <p>Add Category</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isPending}
          required
          autoFocus
          minLength={1}
          placeholder="blog name"
        />

        <div className="">
          <Button type="submit" disabled={isPending}>
            Create
          </Button>
        </div>
      </form>
    </div>
  );
};
