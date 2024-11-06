import { Doc, Id } from "../../convex/_generated/dataModel";
import { useCurrentUser } from "@/features/auth/api/use-current-user"; 
import { cn } from "@/lib/utils";
import { Hint } from "./hint";
import { EmojiPopOver } from "./emoji-popover";
import { MdOutlineAddReaction } from "react-icons/md";

interface ReactionsProps {
    data: Array<
    Omit<Doc<"reactions">, "userId"> & {
        count: number;
        userIds: Id<"users">[]
    }>;
    onChange: (value: string) => void;
    isCheckBooked: boolean | null | undefined
}

export const Reactions = ({
    data,
    onChange,
    isCheckBooked
} : ReactionsProps) => {
    const { data: currentUser } = useCurrentUser()

    const currentUserId = currentUser?._id;

    if(!data || data.length === 0 || !currentUserId) {
        return null
    }


    return (
        <div className="flex items-center gap-1 mb-1">
            {data.map((reaction) => (
                <Hint key={reaction._id} label={`${reaction.count} ${reaction.count === 1 ? "person" : "people"} reacted with ${reaction.value}`}>

                <button className={cn(
                    "h-6 px-2 rounded-full bg-slate-200 border border-transparent text-slate-800 flex items-center gap-x-1",
                    reaction.userIds.includes(currentUserId) && "bg-blue-100/70 border-blue-500 text-white"
                )}
                onClick={isCheckBooked ? () => onChange(reaction.value) : undefined } 
                >
                    {reaction.value}
                    <span
                        className={cn(
                            "text-sm font-semibold text-muted-foreground",
                            reaction.userIds.includes(currentUserId) && "text-blue-500"
                        )}
                    >{reaction.count}</span>
                </button>
                </Hint>

            ))}
            {isCheckBooked && (
            <EmojiPopOver
                hint="Add reaction"
                onEmojiSelect={(emoji) => onChange(emoji)}
            >
                <button className="h-7 px-3 rounded-full bg-slate-200/70 border border-transparent hover:border-slate-500 text-slate-800 flex items-center gap-x-1">
                    <MdOutlineAddReaction className="size-4"/>
                </button>
            </EmojiPopOver>
            )}
        </div>
    )
}
