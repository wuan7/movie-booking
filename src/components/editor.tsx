import { MdSend } from "react-icons/md";
import { Button } from "./ui/button";
import { ImageIcon, Smile, XIcon } from "lucide-react";
import { Hint } from "./hint";
import { EmojiPopOver } from "./emoji-popover";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
type EditorValue = {
  image: File | null;
  text: string;
  setText: (text: string) => void;
  setImage: (value: File | null) => void;
  rating: string;
  tags: string[] | undefined
};

type replyValue = {
  image: File | null;
  text: string;
};

interface EditorProps {
  variant?: "create" | "update" | "thread";
  layout?: string;
  isParentMessage?: boolean;
  disabled?: boolean;
  defaultValue?: string;
  onCancel?: () => void;
  onSubmit?: ({ image, text, setText, setImage, rating, tags }: EditorValue) => void;
  onReplySubmit?: ({ image, text }: replyValue) => void;
}

const ratings = [
  {
    value: "1",
    description: "1/10 Kén người mê",
  },
  {
    value: "2",
    description: "2/10 Kén người mê",
  },
  {
    value: "3",
    description: "3/10 Kén người mê",
  },
  {
    value: "4",
    description: "4/10 Tạm ổn",
  },
  {
    value: "5",
    description: "5/10 Tạm ổn",
  },
  {
    value: "6",
    description: "6/10 Tạm ổn",
  },
  {
    value: "7",
    description: "7/10 Đáng xem",
  },
  {
    value: "8",
    description: "8/10 Đáng xem",
  },
  {
    value: "9",
    description: "9/10 Cực phẩm",
  },
  {
    value: "10",
    description: "10/10 Cực phẩm",
  },
];

const tags = [
  "Đáng xem",
  "Kịch tính",
  "Cảm động",
  "Siêu phẩm",
  "Tuyệt vời",
  "Giải trí",
  "Hài lòng",
  "Nhân văn",
  "Ý nghĩa",
  "Hồi hộp",
  "Ổn áp",
  "Kinh dị",
  "Thú vị",
  "Hấp dẫn",
]
const Editor = ({
  variant,
  disabled,
  onSubmit,
  defaultValue,
  onCancel,
  layout,
  onReplySubmit,
  isParentMessage,
}: EditorProps) => {
  const imageElementRef = useRef<HTMLInputElement | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [rating, setRating] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  useEffect(() => {
    setText(defaultValue || "");
  }, [defaultValue]);

  const handleSeatClick = (tag: string) => {
    const isSelected = selectedTags.some((t) => t === tag);
    if (isSelected) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  const onEmojiSelect = (emojiValue: string) => {
    setText((prevText) => prevText + emojiValue);
  };
  const handleUpload = () => {
    imageElementRef.current?.click();
  };
  const isEmpty = !image && text.replace(/<(.|\n)*?>/g, "").trim().length === 0;
  return (
    <div>
      {isParentMessage  && (
        <>
        
        <div className="">
          <Select onValueChange={(value: string) => setRating(value)}>
            <SelectTrigger className="w-[180px] bg-slate-800">
              <SelectValue placeholder="Đánh giá ngay" className="text-white" />
            </SelectTrigger>
            <SelectContent>
              {ratings.map((rate, i) => (
                <SelectItem key={i} value={rate.value}>
                  {rate.description}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2 my-2 overflow-x-auto custom-scrollbar pb-2">
          {tags.map((tag, i) => (
            <Button onClick={() => handleSeatClick(tag)} key={i} variant="ghost" size="sm" className="bg-slate-800 text-white">
              {tag}
            </Button>
          ))}
        </div>
        {selectedTags && (
           <div className="flex gap-2 mb-2">
           {selectedTags.map((tag, i) => (
             <div key={i} className="bg-slate-400 p-1 text-xs rounded-md">{tag}</div>
           ))}
         </div>
        )}
        </>
      )}
      <Textarea
        value={text}
        className={cn("mt-1 bg-slate-800 mb-1")}
        placeholder="Bình luận..."
        onChange={(e) => setText(e.target.value)}
      ></Textarea>
      <div className={cn("flex p-2 z-[5] bg-slate-800")}>
        <EmojiPopOver onEmojiSelect={onEmojiSelect}>
          <Button disabled={disabled} size="iconSm" variant="ghost">
            <Smile className="size-4 z-[5]" />
          </Button>
        </EmojiPopOver>
        <Hint label="Image">
          <Button
            disabled={disabled}
            size="iconSm"
            variant="ghost"
            onClick={handleUpload}
          >
            <ImageIcon className="size-4" />
          </Button>
        </Hint>
        {variant === "update" && (
          <div className="ml-auto flex items-center gap-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onCancel}
              disabled={disabled}
              className="text-black"
            >
              Cancel
            </Button>
            {layout === "thread" && onReplySubmit ? (
              <Button
                size="sm"
                onClick={() => {
                  onReplySubmit({
                    text,
                    image,
                  });
                }}
                disabled={disabled || isEmpty}
                className=" bg-[#007a5a] hover:bg-[#007a5a] text-white"
              >
                Save
              </Button>
            ) : (
              onSubmit && (
                <Button
                  size="sm"
                  onClick={() => {
                    onSubmit({
                      text,
                      image,
                      setText,
                      setImage,
                      rating,
                      tags: selectedTags
                    });
                  }}
                  disabled={disabled || isEmpty}
                  className=" bg-[#007a5a] hover:bg-[#007a5a] text-white"
                >
                  Save
                </Button>
              )
            )}
          </div>
        )}

        {variant === "create" && onSubmit && (
          <Button
            disabled={disabled || isEmpty}
            onClick={() => {
              onSubmit({
                image,
                text,
                setText,
                setImage,
                rating,
                tags: selectedTags
              });
            }}
            size="iconSm"
            className={cn(
              "ml-auto",
              isEmpty
                ? "bg-white hover:bg-white text-muted-foreground"
                : "bg-[#007a5a] hover:bg-[#007a5a] text-white"
            )}
          >
            <MdSend className="size-4" />
          </Button>
        )}

        <input
          type="file"
          accept="image/*"
          ref={imageElementRef}
          onChange={(event) => setImage(event.target.files![0])}
          className="hidden"
        />
      </div>
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
    </div>
  );
};

export default Editor;
