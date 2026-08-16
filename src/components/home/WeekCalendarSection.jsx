import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import GoogleCalendar from "../../assets/icons/calendar_icon.svg";
import DayItem from "./DayItem";
import useGoogleCalendarStore from "../../store/useGoogleCalendarStore";
import { getWeeklyMissionStatus } from "../../api/mission";
import { formatApiDate, getDate } from "../../utils/getDate";

/**
 * 아직 응답을 못 받았거나 실패했을 때 보여줄 빈 한 주.
 *
 * 칸이 없으면 화면이 출렁이니 월요일부터 7칸을 미리 깔아둡니다.
 */
const buildEmptyWeek = (today) => {
  const monday = new Date(today);

  // getDay() 는 일요일이 0 이라, 월요일이 0 이 되도록 돌려서 뺍니다.
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));

  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(monday);

    day.setDate(monday.getDate() + index);

    return { date: formatApiDate(day), completed: false };
  });
};

export default function WeekCalenderSection() {
  const navigate = useNavigate();
  const isConnected = useGoogleCalendarStore((state) => state.isConnected);

  // 화면이 떠 있는 동안 기준 날짜가 바뀌면 곤란해서 마운트 때 한 번만 잡습니다.
  const [today] = useState(() => new Date());
  const todayKey = formatApiDate(today);

  const [days, setDays] = useState(() => buildEmptyWeek(today));

  useEffect(() => {
    let alive = true;

    getWeeklyMissionStatus(todayKey)
      .then((data) => {
        if (alive && data?.days) {
          setDays(data.days);
        }
      })
      .catch((error) => {
        // 못 받아와도 빈 주를 그대로 두고 화면은 살려둡니다.
        console.warn("주간 미션 현황을 불러오지 못했어요.", error);
      });

    return () => {
      alive = false;
    };
  }, [todayKey]);

  return (
    <div>
      <div className="flex gap-16.5 mt-12">
        <div className="text-lg font-semibold text-emerald-300 pl-7.75">
          {today.getMonth() + 1}월 {today.getDate()}일({getDate(todayKey)})
        </div>
        <button
          onClick={() => !isConnected && navigate("/home/google-calendar-sync")}
          className="flex items-center gap-1.75 cursor-pointer"
        >
          <img src={GoogleCalendar} className="size-4" />
          <div className="text-sm font-medium">
            {isConnected ? "Google 캘린더 연동중" : "Google 캘린더 연동하기"}
          </div>
        </button>
      </div>
      <div className="flex gap-4.5 pl-6.25 mt-3.5">
        {days.map((day) => (
          <DayItem key={day.date} day={day} isToday={day.date === todayKey} />
        ))}
      </div>
    </div>
  );
}
