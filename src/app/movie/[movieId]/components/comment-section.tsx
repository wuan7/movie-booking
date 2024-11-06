import { ChatInput } from "./chat-input";
import { useMovieId } from "@/hooks/use-movie-id";
import { useCurrentUser } from "@/features/auth/api/use-current-user";
import { useCheckBooked } from "@/features/booking/api/use-check-booked";
import { Id } from "../../../../../convex/_generated/dataModel";
import { useGetMessages } from "@/features/messages/api/use-get-messages";
import { MessageList } from "@/components/message-list";
import { Loader, Star } from "lucide-react";
import { useGetMovieRating } from "@/features/messages/api/use-get-movie-rating";

export const CommentSection = () => {
  const movieId = useMovieId();
  const currentUser = useCurrentUser();
  const userId = currentUser.data?._id as Id<"users">;
  const { data: isBooked } = useCheckBooked({ userId, movieId });
  const { results, status, loadMore, isLoading } = useGetMessages({ movieId });
  const { data: movieRating } = useGetMovieRating({ movieId });

  return (
    <div className="text-white mt-5 p-2 ">
      <h1 className=" font-semibold text-sm">Bình luận từ người xem</h1>
      {isBooked && (
        <div className="my-2 space-y-2 shadow-sm shadow-neutral-400 p-3">
          <h2 className="font-semibold">Đánh giá của bạn</h2>

          <div className="relative">
            <ChatInput />
          </div>
        </div>
      )}

      {isLoading && (
        <div className="w-full h-56 flex items-center justify-center  shadow-md shadow-white">
          <div className="flex flex-col items-center justify-center text-white">
            <Loader className="size-10 text-white animate-spin" />
          </div>
        </div>
      )}

      {results.length === 0 && !isLoading && (
        <div className="w-full h-56 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center text-white">
            <p className="text-xs">Hiện tại chưa có bình luận nào.</p>
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div className="flex items-center gap-x-3">
          <Star className="size-5 text-yellow-400 fill-yellow-500" />
          <p className="text-muted-foreground">
            {movieRating?.averageRating}/10 - {movieRating?.totalRatings} người
            đánh giá
          </p>
        </div>
      )}

      <MessageList
        data={results}
        loadMore={loadMore}
        isLoadingMore={status === "LoadingMore"}
        canLoadMore={status === "CanLoadMore"}
      />
    </div>
  );
};
