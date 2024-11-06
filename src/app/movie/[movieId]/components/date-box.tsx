import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { format, addDays, isToday } from "date-fns";
import { useDate } from "@/features/showtimes/store/use-showtime";
export const DateBox = () => {
  const [, setDate] = useDate();

  const daysToShow = Array.from({ length: 15 }, (_, index) => {
    const date = addDays(new Date(), index);
    const dayName = isToday(date) ? "Today" : format(date, "EEEE");
    const formattedDate = format(date, "dd");
    const formattedFullDate = format(date, "MM/dd/yyyy");
    return { dayName, formattedDate, formattedFullDate };
  });
  const [selectedDay, setSelectedDay] = useState<string>("");

  useEffect(() => {
    if (daysToShow.length > 0) {
      setSelectedDay(daysToShow[0].formattedFullDate);
      setDate(selectedDay);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleSlectDate = (day: {
    dayName: string;
    formattedDate: string;
    formattedFullDate: string;
  }) => {
    setSelectedDay(day.formattedFullDate);
    setDate(day.formattedFullDate);
  };
  return (
    <div className="flex space-y-2 w-full  p-3 bg-gray-900 shadow-md shadow-white">
      <div className="flex gap-x-2 overflow-x-auto custom-scrollbar pb-2">
        {daysToShow.map((day) => (
          <button
            key={day.formattedDate}
            onClick={() => handleSlectDate(day)}
            className=" border border-white/85 hover:border-white flex flex-col items-center justify-center rounded-sm"
          >
            <div
              className={cn(
                "bg-slate-300 w-16 h-8 flex items-center justify-center font-semibold text-black rounded-t-sm",
                selectedDay === day.formattedFullDate &&
                  "bg-pink-500 text-white"
              )}
            >
              {day.formattedDate}
            </div>
            <div
              className={cn(
                "bg-slate-100 text-black w-16 h-8 flex items-center justify-center  rounded-b-sm text-xs truncate px-1",
                selectedDay === day.formattedFullDate && " text-pink-500"
              )}
            >
              {day.dayName}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
