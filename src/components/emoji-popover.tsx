import React, { useState } from "react";
import EmojiPicker, {type EmojiClickData } from "emoji-picker-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface EmojiPopOverProps {
  children: React.ReactNode;
  hint?: string;
  onEmojiSelect: (emoji: string) => void;
}

export const EmojiPopOver = ({
  children,
  hint = "Emoji",
  onEmojiSelect,
}: EmojiPopOverProps) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);


    const onSelect = (value: EmojiClickData) => {
        onEmojiSelect(value.emoji);
        setPopoverOpen(false);

        setTimeout(() => {
            setTooltipOpen(false);
        }, 500)
    }

  return (
    <TooltipProvider>
    <Tooltip
      open={tooltipOpen}
      onOpenChange={setTooltipOpen}
      delayDuration={50}
    >
      <TooltipTrigger asChild>
        <span> {/* Đảm bảo TooltipTrigger chỉ có một phần tử con */}
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <span> {/* Đảm bảo PopoverTrigger chỉ có một phần tử con */}
                {children} {/* Thành phần kích hoạt Tooltip và Popover */}
              </span>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-full border-none shadow-none z-50 pointer-events-auto">
              <EmojiPicker onEmojiClick={onSelect} />
            </PopoverContent>
          </Popover>
        </span>
      </TooltipTrigger>
      <TooltipContent className="bg-black text-white border border-white/5 !z-50 pointer-events-auto">
        <p className="font-medium text-xs">{hint}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
  );
};