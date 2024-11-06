import {  useState } from "react";
import { Button } from "@/components/ui/button";
import { Id } from '../../../../convex/_generated/dataModel';
import { AlertTriangle, Loader, XIcon } from "lucide-react";
import { useGetMessage } from "../api/use-get-mesage";
import { Message } from "@/components/message";
import { useCurrentUser } from "@/features/auth/api/use-current-user";
import { useGenerateUploadUrl } from "@/features/upload/api/use-generate-upload-url";
import { toast } from "sonner";
import { differenceInMinutes, format, isToday, isYesterday } from "date-fns";
import Editor from "@/components/editor";
import { useMovieId } from "@/hooks/use-movie-id";
import { useGetReplies } from "@/features/replies/api/use-get-replies";
import { useCreateReply } from "@/features/replies/api/use-create-reply";
import { useCheckBooked } from "@/features/booking/api/use-check-booked";

interface ThreadProps {
  messageId: Id<"messages">;
  onClose: () => void;
  onUserIdClose: () => void;
  userId: string;
}
const TIME_THRESHOLD = 5;
type CreateMesageValues = {
  movieId: Id<"movies">;
  text: string;
  image?: Id<"_storage"> | undefined;
  messageId: Id<"messages">
};

const formatDateLable = (dateStr: string) => {
  const date = new Date(dateStr);
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "EEEE, MMMM d");
};

export const Thread = ({ messageId, onClose, userId, onUserIdClose }: ThreadProps) => {
  const movieId = useMovieId();
  const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);
  const [editingReplyId, setEditingReplyId] = useState<Id<"replies"> | null>(null);
  const [editorKey, setEditorKey] = useState(0);
  const [isPending, setIsPending] = useState(false);
  const { mutate: createReply } = useCreateReply();
  const { mutate: generateUploadUrl } = useGenerateUploadUrl();
  const { data: currentUser } = useCurrentUser();
  const currentUsserId = currentUser?._id as Id<"users">
  const userIdF = userId as Id<"users">;
  const { data: message, isLoading: loadingMessage } = useGetMessage({
    id: messageId,
    userId: userIdF
  });
  const { results, status, loadMore } = useGetReplies({
    movieId,
    messageId,

  });
  const { data : isCheckBooked} = useCheckBooked({ userId: currentUsserId, movieId})
  const canLoadMore = status === "CanLoadMore";
  const isLoadingMore = status === "LoadingMore";
  const handleClose = () => {
    onClose();
    onUserIdClose();
  }
  const handleSubmit = async ({
    text,
    image,
  }: {
    text: string;
    image: File | null;
  }) => {
    console.log({ text, image });
    try {
      setIsPending(true);
      const values: CreateMesageValues = {
        movieId,
        text,
        image: undefined,
        messageId: messageId as Id<"messages">,
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

      await createReply(values, { throwError: true });
      setEditorKey((prev) => prev + 1);
    } catch (error) {
      console.log(error);
      toast.error("Failed to send message");
    } finally {
      setIsPending(false);
    }
  };
  const groupedMessages = results?.reduce(
    (groups, message) => {
      const date = new Date(message._creationTime);
      const dateKey = format(date, "yyy-MM-dd");
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].unshift(message);
      return groups;
    },
    {} as Record<string, typeof results>
  );

  if (loadingMessage || status === "LoadingFirstPage") {
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center h-[49px] p-4 border-b">
          <p className="text-lg font-bold">Thread</p>
          <Button onClick={handleClose} size="iconSm" variant="ghost">
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex flex-col gap-y-2 h-full items-center justify-center">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }
  if (!message) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center h-[49px] p-4 border-b">
          <p className="text-lg font-bold">Thread</p>
          <Button onClick={handleClose} size="iconSm" variant="ghost">
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex flex-col gap-y-2 h-full items-center justify-center">
          <AlertTriangle className="size-5  text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Message not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-b   from-[#0F172A] to-[#131d36] text-white p-2">
      <div className="flex justify-between items-center h-[49px] py-2 border-b">
        <p className="text-lg font-bold">Bình luận</p>
        <Button onClick={handleClose} size="iconSm" variant="ghost">
          <XIcon className="size-5 stroke-[1.5]" />
        </Button>
      </div>
      <div className="flex-1 flex flex-col-reverse  pb-4 overflow-y-auto messages-crollbar">
        {Object.entries(groupedMessages || {}).map(([dateKey, messages]) => (
          <div key={dateKey}>
            <div className="text-center my-2 relative">
              <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
              <span className="relative inline-block bg-white text-black px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
                {formatDateLable(dateKey)}
              </span>
            </div>
            {messages.map((message, index) => {
              const preMessage = messages[index - 1];
              const isCompact =
                preMessage &&
                preMessage.user?._id === message.user?._id &&
                differenceInMinutes(
                  new Date(message._creationTime),
                  new Date(preMessage._creationTime)
                ) < TIME_THRESHOLD;
              return (
                <Message
                  key={message._id}
                  id={message.messageId}
                  userId={message.userId}
                  authorImage={message.user.image}
                  authorName={message.user.name}
                  isAuthor={message.userId === currentUser?._id}
                  reactions={message.reactions}
                  text={message.text}
                  image={message.image}
                  updatedAt={message.updatedAt}
                  createdAt={message._creationTime}
                  isEditing={editingId === message.messageId}
                  setEditingId={setEditingId}
                  isReplyEditingId={editingReplyId === message._id}
                  setEditingReplyId={setEditingReplyId}
                  isCompact={isCompact}
                  hideThereadButton
                  layout="thread"
                  replyId={message._id}
                  
                />
              );
            })}
          </div>
        ))}
        <div
          className="h-1"
          ref={(el) => {
            if (el) {
              const observer = new IntersectionObserver(
                ([entry]) => {
                  if (entry.isIntersecting && canLoadMore) {
                    loadMore();
                  }
                },
                { threshold: 1.0 }
              );
              observer.observe(el);
              return () => observer.disconnect();
            }
          }}
        />
        {isLoadingMore && (
          <div className="text-center my-2 relative">
            <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
            <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
              <Loader className="size-4 animate-spin" />
            </span>
          </div>
        )}

       
        <Message
          hideThereadButton
          userId={message.userId}
          authorImage={message.user.image}
          authorName={message.user.name}
          isAuthor={message.userId === currentUser?._id}
          text={message.text}
          image={message.image}
          createdAt={message._creationTime}
          updatedAt={message.updatedAt}
          id={message._id}
          reactions={message.reactions}
          isEditing={editingId === message._id}
          setEditingId={setEditingId}
          isParentMessage={true}
          rating={message.rating}
          tags={message.tags}
        />
      </div>
       {isCheckBooked && (
      <div className="">
        <Editor key={editorKey} onSubmit={handleSubmit} disabled={isPending} variant="create"/>
      </div>
        )}
    </div>
  );
};
