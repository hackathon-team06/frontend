import GoogleCalendar from "../../assets/icons/calendar_icon.svg";
import DayItem from "./DayItem";

export default function WeekCalenderSection({ weekData, today }) {
  return (
    <div>
      <div className="flex gap-16.5 mt-12">
        <div className="text-lg font-semibold text-emerald-300 pl-7.75">
          7월 30일(목)
        </div>
        <button className="flex items-center gap-1.75 cursor-pointer">
          <img src={GoogleCalendar} className="size-4" />
          <div className="text-sm font-medium">Google 캘린더 연동하기</div>
        </button>
      </div>
      <div className="flex gap-4.5 pl-6.25 mt-3.5">
        {weekData.map((day) => (
          <DayItem key={day.date} day={day} isToday={day.date === today} />
        ))}
      </div>
    </div>
  );
}
