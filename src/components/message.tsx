import { format, isToday, isYesterday} from "date-fns";
import { Doc, Id } from "../../convex/_generated/dataModel";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { BadgeCheck, Star } from "lucide-react";
import { Hint } from "./hint";
import { Thumbnail } from "./thumbnail";
import { Toolbar } from "./toolbar";
import { useConfirm } from "@/hooks/use-confirm";
import { useUpdateMessage } from "@/features/messages/api/use-update-message";
import { useRemoveMessage } from "@/features/messages/api/use-remove-message";
import { toast } from "sonner";
import Editor from "./editor";
import { useGenerateUploadUrl } from "@/features/upload/api/use-generate-upload-url";
import { useToggleReaction } from "@/features/reactions/api/use-toggle-reaction";
import { Reactions } from "./reaction";
import { ThreadBar } from "./thread-bar";
import { usePanel } from "@/hooks/use-panel";
import { useToggleReplyReaction } from "@/features/reactions/api/use-toggle-reply-reaction";
import { useUpdateReply } from "@/features/replies/api/use-update-reply";
import { useRemoveReply } from "@/features/replies/api/use-remove-reply";
import { useCheckBooked } from "@/features/booking/api/use-check-booked";
import { useMovieId } from "@/hooks/use-movie-id";
import { useCurrentUser } from "@/features/auth/api/use-current-user";
interface MessageProps {
  id: Id<"messages">;
  userId: Id<"users">;
  authorImage?: string;
  authorName?: string;
  isAuthor: boolean;
  rating?: number;
  text: string;
  image: string | null | undefined;
  createdAt: Doc<"messages">["_creationTime"];
  updatedAt: Doc<"messages">["updatedAt"];
  isEditing: boolean;
  isReplyEditingId?: boolean;
  isCompact?: boolean;
  setEditingId: (id: Id<"messages"> | null) => void;
  setEditingReplyId?: (id: Id<"replies"> | null) => void;
  reactions: Array<
    Omit<Doc<"reactions">, "userId"> & {
      count: number;
      userIds: Id<"users">[];
    }
  >;
  hideThereadButton?: boolean;
  threadCount?: number;
  threadImage?: string;
  threadName?: string;
  threadTimestap?: number;
  isParentMessage?: boolean;
  layout?: string;
  replyId?: Id<"replies">;
  tags?: string[];
}

type UpdateMesageValues = {
  id: Id<"messages">;
  text: string;
  image?: Id<"_storage"> | undefined;
  rating?: string;
  tags: string[] | undefined
};
type UpdateReplyValues = {
  id: Id<"replies">;
  text: string;
  image?: Id<"_storage"> | undefined;
};

const formatFullTime = (date: Date) => {
  return `${isToday(date) ? "Today" : isYesterday(date) ? "Yesterday" : format(date, "MMM d, yyyy")} at ${format(date, "h:mm:ss a")}`;
};

const ratings: {
  [key: number]: string;
} = {
  1: "Kén người mê",
  2: "Kén người mê",
  3: "Kén người mê",
  4: "4Tạm ổn",
  5: "Tạm ổn",
  6: "Tạm ổn",
  7: "Đáng xem",
  8: "Đáng xem",
  9: "Cực phẩm",
  10: "Cực phẩm"
};


export const Message = ({
  id,
  userId,
  authorImage,
  authorName,
  isAuthor,
  text,
  rating,
  image,
  createdAt,
  updatedAt,
  isEditing,
  reactions,
  setEditingId,
  isReplyEditingId,
  setEditingReplyId,
  hideThereadButton,
  threadCount,
  threadImage,
  threadName,
  threadTimestap,
  isParentMessage,
  layout,
  replyId,
  tags
}: MessageProps) => {
  const movieId = useMovieId();
  const currentUser = useCurrentUser();
  const curentUserId = currentUser?.data?._id as Id<"users">
  const ratingN = rating ? rating : 1;
  const [ConfirmDialog, confirm] = useConfirm(
    "Delete comment",
    "Are you sure you want to delete this comment?"
  );
  const { mutate: updateMessage, isPending: isUpdatingMessage } =
    useUpdateMessage();
    const { mutate: updateReply, isPending: isUpdatingReply } =
    useUpdateReply();
  const { mutate: generateUploadUrl } = useGenerateUploadUrl();
  const { mutate: removeMessage, isPending: isRemovingMessage } =
    useRemoveMessage();
    const { mutate: removeReply, isPending: isRemovingReply } =
    useRemoveReply();
  const {
    parentMessageId,
    onOpenMessage,
    onClose,
    onOpenUserId,
    onUserIdClose,
  } = usePanel();
  const { mutate: toggleReaction, isPending: isTogglingReaction } =
    useToggleReaction();
  const { mutate: toggleReplyReaction, isPending: isTogglingReplyReaction } =
    useToggleReplyReaction();
  const {data: isCheckBooked} = useCheckBooked({userId: curentUserId, movieId})
  console.log(isCheckBooked)
  const isPending =
    isUpdatingMessage ||
    isTogglingReaction ||
    isRemovingMessage ||
    isTogglingReplyReaction || isUpdatingReply || isRemovingReply;

  const handleToggleReaction = (value: string) => {
    toggleReaction(
      { messageId: id, value },
      {
        onError: () => {
          toast.error("Failed to toggle reaction");
        },
      }
    );
  };
  const handleToggleReplyReaction = (value: string, replyId: Id<"replies">) => {
    toggleReplyReaction(
      { replyId, value },
      {
        onError: () => {
          toast.error("Failed to toggle reply reaction");
        },
      }
    );
  };

  const handleToogle = (value: string) => {
    if (isParentMessage) {
      handleToggleReaction(value);
    }
    if (layout === "thread" && replyId) {
      handleToggleReplyReaction(value, replyId);
    }
    if (!isParentMessage && layout !== "thread") {
      handleToggleReaction(value);
    }
  };

  const handleEdit = () => {
    if (isParentMessage) {
      setEditingId(id);
    }
    if (
      !isParentMessage &&
      layout === "thread" &&
      replyId &&
      setEditingReplyId
    ) {
      setEditingReplyId(replyId);
    }
    if (!isParentMessage && layout !== "thread") {
      setEditingId(id);
    }
  };

  const handleDelete = async () => {
    const ok = await confirm();
    if (!ok) return;
    if (isParentMessage) {
      removeMessage(
        { id },
        {
          onSuccess: () => {
            toast.success("comment deleted");
            if (parentMessageId === id) {
              onClose();
              onUserIdClose();
            }
          },
          onError: () => {
            toast.error("Failed to delete comment");
          },
        }
      );
    }
    if (
      !isParentMessage &&
      layout === "thread" &&
      replyId
    ) {
      removeReply(
        { id: replyId },
        {
          onSuccess: () => {
            toast.success("comment deleted");
           
          },
          onError: () => {
            toast.error("Failed to delete comment");
          },
        }
      );
    }
    if (!isParentMessage && layout !== "thread") {
      removeMessage(
        { id },
        {
          onSuccess: () => {
            toast.success("comment deleted");
            if (parentMessageId === id) {
              onClose();
              onUserIdClose();
            }
          },
          onError: () => {
            toast.error("Failed to delete comment");
          },
        }
      );
    }
  
  };

  const handleUpdate = async ({
    text,
    image,
    rating,
    tags
  }: {
    text: string;
    image: File | null;
    setText: (text: string) => void;
    setImage: (image: File | null) => void;
    rating: string;
    tags?: string[]
  }) => {
    try {
      const values: UpdateMesageValues = {
        id,
        text,
        image: undefined,
        rating,
        tags: undefined
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
        values.image = storageId;
      }
      if(tags && tags.length > 0) {
        values.tags = tags
      }
      updateMessage(values, {
        onSuccess: () => {
          toast.success("Update comment successfully");
          setEditingId(null);
        },
        onError: (error) => {
          toast.error("Failed to update message id");
          console.log(error);
        },
      });
    } catch (error) {
      console.log(error);
      toast.error("Failed to update message");
    }
  };

  

  const handleReplyUpdate = async ({
    text,
    image,
  }: {
    text: string;
    image: File | null;
   
  }) => {
    try {
      const values: UpdateReplyValues = {
        id: replyId as Id<"replies">,
        text,
        image: undefined,
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
        values.image = storageId;
      }
      updateReply(values, {
        onSuccess: () => {
          toast.success("Update reply  successfully");
          if(setEditingReplyId) {
            setEditingReplyId(null);
          }
        },
        onError: (error) => {
          toast.error("Failed to update reply");
          console.log(error);
        },
      });
    } catch (error) {
      console.log(error);
      toast.error("Failed to update message");
    }
  };

  const handleThread = () => {
    onOpenMessage(id);
    onOpenUserId(userId);
  };

  const handleOpenThread = () => {
    onOpenMessage(id);
    onOpenUserId(userId);
  }
 
  const avatarFallback = authorName?.charAt(0).toUpperCase();
  return (
    <>
      <ConfirmDialog />
      
      <div className="my-5 w-full relative group border-b border-slate-400 last:border-none pb-2">
        <div className="flex items-center gap-x-2">
          <Avatar>
            <AvatarImage
              src={authorImage || "https://github.com/shadcn.png"}
              alt="avatar"
            />
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>
          <div>
            <p>{authorName}</p>
            <div className="flex items-center gap-x-2">
              <span className="text-xs text-muted-foreground">
                {" "}
                <Hint label={formatFullTime(new Date(createdAt))}>
                  <button className="text-xs text-muted-foreground hover:underline">
                    {format(new Date(createdAt), "h:mm a")}
                  </button>
                </Hint>
              </span>
              <div className="flex items-center gap-x-2">
                <BadgeCheck className="size-4 text-pink-500" />
                <p className="text-xs text-pink-500">Đã mua qua Vnpay</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-y-2">
          {isParentMessage && (
          <div className="flex items-center gap-x-1">
            <Star className="size-4 text-yellow-500" />
            <p className="font-bold">{rating}/10 - {ratings[ratingN] }</p>
          </div>
          )}
          <div>
            <p className="text-stone-300">{text}</p>
          </div>
          {isParentMessage && (
          <div className="flex gap-2 mb-2 flex-wrap">
            {tags && tags.length > 0 && tags.map((tag, index) => (
              <div key={index} className="bg-pink-500 p-1 text-xs rounded-md">{tag}</div>
            ))}
          </div>
          )}
          <div className="w-28">
          <Thumbnail url={image} />

          </div>
          {updatedAt ? (
            <span className="text-xs text-muted-foreground">(edited)</span>
          ) : null}
        </div>

        {isEditing && (
          <div className="w-full h-full">
            <Editor
              onSubmit={handleUpdate}
              disabled={isPending}
              defaultValue={text}
              onCancel={() => setEditingId(null)}
              variant="update"
              isParentMessage={isParentMessage}
              layout="thread"
            />
          </div>
        )}
        {isReplyEditingId && (
          <div className="w-full h-full">
            {setEditingReplyId && (
              <Editor
                onReplySubmit={handleReplyUpdate}
                disabled={isPending}
                defaultValue={text}
                onCancel={() => setEditingReplyId(null)}
                variant="update"
                isParentMessage={isParentMessage}
                layout="thread"
              />
            )}
          </div>
        )}
        <div className="flex flex-col w-full overflow-hidden">
          {isCheckBooked && (

          <Toolbar
            isAuthor={isAuthor}
            isPending={isPending}
            handleReaction={handleToogle}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            hideThereadButton={hideThereadButton}
            handleThread={handleThread}
            layout={layout}
            isParentMessage={isParentMessage}
          />
          ) }
          <Reactions data={reactions} onChange={handleToogle} isCheckBooked={isCheckBooked}/>
          <ThreadBar
            count={threadCount}
            image={threadImage}
            name={threadName}
            timestamp={threadTimestap}
            onClick={handleOpenThread}
          />
        </div>
      </div>
    </>
  );
};
