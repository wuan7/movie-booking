import { ArrowDown, Loader } from "lucide-react";
import { GetMessagesReturnType } from "@/features/messages/api/use-get-messages";
import { differenceInMinutes, format, isToday, isYesterday } from "date-fns";
import { useState } from "react";
import { useCurrentUser } from "@/features/auth/api/use-current-user";
import { Message } from "./message";
import { Id } from "../../convex/_generated/dataModel";

const TIME_THRESHOLD = 5;

interface MessageListProps {
  loadMore: () => void;
  data: GetMessagesReturnType | undefined;
  isLoadingMore: boolean;
  canLoadMore: boolean;
  variant?:  "thread" | "comment";
}

const formatDateLable = (dateStr: string) => {
  const date = new Date(dateStr);
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "EEEE, MMMM d");
};
export const MessageList = ({
  data,
  isLoadingMore,
  canLoadMore,
  loadMore,
  variant = "comment"
}: MessageListProps) => {
  const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);
  const { data: currentUser } = useCurrentUser();
  const groupedMessages = data?.reduce(
    (groups, message) => {
      const date = new Date(message._creationTime);
      const dateKey = format(date, "yyy-MM-dd");
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].unshift(message);
      return groups;
    },
    {} as Record<string, GetMessagesReturnType>
  );

 
  return (
    <div className="flex-1 flex flex-col pb-4 ">
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
                rating={message.rating}
                key={message._id}
                id={message._id}
                userId={message.userId}
                authorImage={message.user.image}
                authorName={message.user.name}
                reactions={message.reactions}
                isAuthor={message.userId === currentUser?._id}
                text={message.text}
                image={message.image}
                updatedAt={message.updatedAt}
                createdAt={message._creationTime}
                isEditing={editingId === message._id}
                setEditingId={setEditingId}
                isCompact={isCompact}
                hideThereadButton={variant === "thread"}
                threadCount={message.threadCount}
                threadImage={message.threadImage}
                threadName={message.threadName}
                threadTimestap={message.threadTimestamp}
                isParentMessage={true}
                tags={message.tags}
              />
            );
          })}
        </div>
      ))}
      <div
        // className="h-1"
        // ref={(el) => {
        //   if (el) {
        //     const observer = new IntersectionObserver(
        //       ([entry]) => {
        //         if (entry.isIntersecting && canLoadMore) {
        //           loadMore();
        //         }
        //       },
        //       { threshold: 1.0 }
        //     );
        //     observer.observe(el);
        //     return () => observer.disconnect();
        //   }
        // }}
      />
      {isLoadingMore && (
        <div className="text-center my-2 relative">
          <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
          <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
            <Loader className="size-4 animate-spin text-black" />
          </span>
        </div>
      )}
       {canLoadMore && (
      <div className="flex justify-center mt-4">
        <button
          onClick={loadMore}
          disabled={isLoadingMore}
          className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center gap-x-2"
        >
            <ArrowDown className="size-4 animate-bounce"/>
            <p>Xem thêm</p>
          
        </button>
      </div>
    )}
    </div>
  );
};
