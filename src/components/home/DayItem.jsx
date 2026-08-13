import Check from "../../assets/icons/check_icon.svg";
import { getDate } from "../../utils/getDate";

export default function DayItem({ day, isToday }) {
  return (
    <div className="flex flex-col gap-2 justify-center items-center">
      <div
        className={`flex justify-center items-center text-sm size-6 rounded-[42px] ${isToday ? "font-semibold bg-emerald-300 text-white" : "font-medium text-neutral-400"}`}
      >
        {getDate(day.date)}
      </div>
      <div
        className={`flex justify-center items-center rounded-[20px] size-8  ${day.completed ? "bg-emerald-300" : "bg-neutral-100"}`}
      >
        {day.completed && <img src={Check} />}
      </div>
    </div>
  );
}
//