import {  MessageSquareTextIcon, Pencil, Smile, Trash } from "lucide-react";
import { Button } from "./ui/button";
import { Hint } from "./hint";
import { EmojiPopOver } from "./emoji-popover";
import { cn } from "@/lib/utils";

interface ToolbarProps {
  isAuthor: boolean;
  isPending: boolean;
  handleEdit: () => void;
  handleDelete: () => void;
  handleReaction: (value: string) => void;
  hideThereadButton?: boolean;
  handleThread: () => void;
  layout?:string;
  isParentMessage?: boolean
}

export const Toolbar = ({
  isAuthor,
  isPending,
  handleEdit,
  handleDelete,
  handleReaction,
  hideThereadButton,
  handleThread,
  layout,
}: ToolbarProps) => {
  return (
    <div className="absolute top-0 right-5 ">
      <div className={cn("group-hover:opacity-100 opacity-0 transition-opacity border bg-gray-900  rounded-md shadow-sm")}>
        <EmojiPopOver
          hint="Add reaction"
          onEmojiSelect={(emoji) => handleReaction(emoji)}
        >
          <Button variant="ghost" size="iconSm" disabled={isPending}>
            <Smile className="size-4 " />
          </Button>
        </EmojiPopOver>
        {!hideThereadButton  && !layout && (
          <Hint label="Reply in thread">
            <Button variant="ghost" size="iconSm" disabled={isPending} onClick={handleThread}>
              <MessageSquareTextIcon className="size-4" />
            </Button>
          </Hint>
        )}

        {isAuthor && (
          <Hint label="Edit message">
            <Button variant="ghost" size="iconSm" disabled={isPending} onClick={handleEdit}>
              <Pencil className="size-4" />
            </Button>
          </Hint>
        )}

        {isAuthor && (
          <Hint label="Delete message">
            <Button variant="ghost" size="iconSm" disabled={isPending} onClick={handleDelete}>
              <Trash className="size-4" />
            </Button>
          </Hint>
        )}
      </div>
    </div>
  );
};