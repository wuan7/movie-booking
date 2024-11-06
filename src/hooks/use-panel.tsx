import { useParentMessageId } from "@/features/messages/store/use-parent-message-id";
import { useUserId } from "@/features/messages/store/use-user-id";
export const usePanel = () => {
    const [parentMessageId, setParentMessageId] = useParentMessageId();
    const [userId, setUserId] = useUserId();
    const onOpenMessage = (messageId: string) => {
        setParentMessageId(messageId);
    }
    const onClose = () => {
        setParentMessageId(null);
    }
    const onOpenUserId = (userId: string) => {
        setUserId(userId);
    }
    const onUserIdClose = () => {
        setUserId(null);
    }
    return {
        parentMessageId,
        onOpenMessage,
        onClose,
        userId,
        onOpenUserId,
        onUserIdClose
    }
}