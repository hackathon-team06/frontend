import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import WeatherTipSection from "../../components/home/WeatherTipSection";
import WeekCalenderSection from "../../components/home/WeekCalendarSection";
import StampProgressBtn from "../../components/home/StampProgressBtn";
import { getSchedulesByDate } from "../../api/schedule";
import useAuthStore from "../../store/useAuthStore";
import useOnboardingStore from "../../store/useOnboardingStore";

import map7 from "../../assets/images/map7.svg";
import map14 from "../../assets/images/map14.svg";
import map21 from "../../assets/images/map21.svg";
import map28 from "../../assets/images/map28.svg";
import stamp from "../../assets/images/home_stamp.svg";

import alcoholIcon from "../../assets/icons/alcohol_icon.svg";
import birthdayIcon from "../../assets/icons/birthday_icon.svg";
import dateIcon from "../../assets/icons/date_icon.svg";
import weddingIcon from "../../assets/icons/wedding_icon.svg";
import travelIcon from "../../assets/icons/travel_icon.svg";
import meetingIcon from "../../assets/icons/meeting_icon.svg";
import selfcareIcon from "../../assets/icons/selfcare_icon.svg";
import eventIcon from "../../assets/icons/event_icon.svg";

const STAMP_PERIOD_CONFIGS = {
  7: {
    mapImage: map7,
    goalDay: 7,
    dDay: 4,

    mapHeight: 480,
    mapWidth: 370,
    mapMarginTop: 0,

    stampPositions: [
      "top-[135px] left-[95px]",
      "top-[30px] left-[45px]",
      "top-[30px] left-[190px]",
    ],

    goClassName: "top-[170px] left-[230px]",

    periodNumbers: [
      {
        number: 5,
        className: "top-[265px] left-[200px]",
      },
      {
        number: 6,
        className: "top-[265px] left-[75px]",
      },
    ],

    goalClassName: "top-[360px] left-[120px]",
  },

  14: {
    mapImage: map14,
    goalDay: 14,
    dDay: 11,

    mapWidth: 330,
    mapHeight: 530,
    mapMarginTop: 52,

    stampPositions: [
      "-top-[22px] left-[40px]",
      "-top-[22px] left-[145px]",
      "-top-[22px] left-[245px]",
    ],

    goClassName: "top-[65px] left-[195px]",

    periodNumbers: [
      {
        number: 5,
        className: "top-[65px] left-[90px]",
      },
      {
        number: 6,
        className: "top-[155px] left-[40px]",
      },
      {
        number: 7,
        className: "top-[155px] left-[145px]",
      },
      {
        number: 8,
        className: "top-[155px] left-[245px]",
      },
      {
        number: 9,
        className: "top-[245px] left-[195px]",
      },
      {
        number: 10,
        className: "top-[245px] left-[90px]",
      },
      {
        number: 11,
        className: "top-[335px] left-[40px]",
      },
      {
        number: 12,
        className: "top-[335px] left-[145px]",
      },
      {
        number: 13,
        className: "top-[335px] left-[245px]",
      },
    ],

    goalClassName: "top-[420px] left-[135px]",
  },

  21: {
    mapImage: map21,
    goalDay: 21,
    dDay: 18,

    mapHeight: 660,
    mapWidth: 370,
    mapMarginTop: 52,

    stampPositions: [
      "-top-[10px] left-[30px]",
      "-top-[10px] left-[130px]",
      "-top-[10px] left-[230px]",
    ],

    goClassName: "top-[73px] left-[285px]",

    periodNumbers: [
      {
        number: 5,
        className: "top-[85px] left-[180px]",
      },
      {
        number: 6,
        className: "top-[85px] left-[80px]",
      },
      {
        number: 7,
        className: "top-[130px] left-[7px]",
      },
      {
        number: 8,
        className: "top-[175px] left-[100px]",
      },
      {
        number: 9,
        className: "top-[175px] left-[210px]",
      },
      {
        number: 10,
        className: "top-[215px] left-[310px]",
      },
      {
        number: 11,
        className: "top-[260px] left-[210px]",
      },
      {
        number: 12,
        className: "top-[260px] left-[90px]",
      },
      {
        number: 13,
        className: "top-[315px] left-[7px]",
      },
      {
        number: 14,
        className: "top-[350px] left-[110px]",
      },
      {
        number: 15,
        className: "top-[350px] left-[225px]",
      },
      {
        number: 16,
        className: "top-[395px] left-[307px]",
      },
      {
        number: 17,
        className: "top-[440px] left-[230px]",
      },
      {
        number: 18,
        className: "top-[440px] left-[130px]",
      },
      {
        number: 19,
        className: "top-[440px] left-[30px]",
      },
      {
        number: 20,
        className: "top-[525px] left-[25px]",
      },
    ],

    goalClassName: "top-[535px] left-[150px]",
  },

  28: {
    mapImage: map28,
    goalDay: 28,
    dDay: 25,

    mapHeight: 900,
    mapWidth: 370,

    stampPositions: [
      "top-[5px] left-[30px]",
      "top-[5px] left-[130px]",
      "top-[5px] left-[230px]",
    ],

    goClassName: "top-[90px] left-[270px]",

    periodNumbers: [
      {
        number: 5,
        className: "top-[90px] left-[175px]",
      },
      {
        number: 6,
        className: "top-[90px] left-[75px]",
      },
      {
        number: 7,
        className: "top-[145px] left-[7px]",
      },
      {
        number: 8,
        className: "top-[180px] left-[100px]",
      },
      {
        number: 9,
        className: "top-[180px] left-[210px]",
      },
      {
        number: 10,
        className: "top-[220px] left-[305px]",
      },
      {
        number: 11,
        className: "top-[265px] left-[210px]",
      },
      {
        number: 12,
        className: "top-[265px] left-[90px]",
      },
      {
        number: 13,
        className: "top-[345px] left-[20px]",
      },
      {
        number: 14,
        className: "top-[350px] left-[130px]",
      },
      {
        number: 15,
        className: "top-[350px] left-[230px]",
      },
      {
        number: 16,
        className: "top-[400px] left-[305px]",
      },
      {
        number: 17,
        className: "top-[440px] left-[230px]",
      },
      {
        number: 18,
        className: "top-[440px] left-[135px]",
      },
      {
        number: 19,
        className: "top-[440px] left-[40px]",
      },
      {
        number: 20,
        className: "top-[525px] left-[70px]",
      },
      {
        number: 21,
        className: "top-[525px] left-[165px]",
      },
      {
        number: 22,
        className: "top-[525px] left-[260px]",
      },
      {
        number: 23,
        className: "top-[615px] left-[200px]",
      },
      {
        number: 24,
        className: "top-[615px] left-[80px]",
      },
      {
        number: 25,
        className: "top-[695px] left-[50px]",
      },
      {
        number: 26,
        className: "top-[695px] left-[150px]",
      },
      {
        number: 27,
        className: "top-[695px] left-[255px]",
      },
    ],

    goalClassName: "top-[785px] left-[140px]",
  },
};

const companionLabelMap = {
  LOVER: "연인",
  COWORKER: "직장동료",
  FRIEND: "친구",
  FAMILY: "가족/친척",
  ACQUAINTANCE: "지인/모임",
};

const categoryLabelMap = {
  DATE: "데이트",
  MEETING: "미팅/면접",
  SELF_CARE: "자기관리",
  SELFCARE: "자기관리",
  DRINKING: "술자리모임",
  TRAVEL: "여행",
  WEDDING: "결혼식",
  EVENT: "이벤트",
  TALK: "친목/수다",
  CEREMONY: "행사",
};

const getUserIdFromToken = (accessToken) => {
  if (!accessToken) return null;

  try {
    const payload = accessToken.split(".")[1];
    const decodedPayload = JSON.parse(atob(payload));

    return Number(decodedPayload.sub);
  } catch (error) {
    console.error("사용자 ID 확인 실패:", error);
    return null;
  }
};

const hasFinalConsonant = (word) => {
  const lastChar = word[word.length - 1];

  if (!/[가-힣]/.test(lastChar)) {
    return false;
  }

  const code = lastChar.charCodeAt(0) - 0xac00;

  return code % 28 !== 0;
};

const getScheduleText = (person, schedule) => {
  if (schedule === "결혼식") {
    return `${person}의 ${schedule}`;
  }

  const particle = hasFinalConsonant(person) ? "과" : "와";

  return `${person}${particle} ${schedule}`;
};

const getScheduleIcon = (schedule) => {
  switch (schedule) {
    case "여행":
      return travelIcon;

    case "결혼식":
      return weddingIcon;

    case "데이트":
      return dateIcon;

    case "미팅/면접":
    case "친목/수다":
      return meetingIcon;

    case "자기관리":
      return selfcareIcon;

    case "술자리모임":
      return alcoholIcon;

    case "이벤트":
    case "행사":
      return eventIcon;

    case "생일":
      return birthdayIcon;

    default:
      return null;
  }
};

const formatDate = (date) => {
  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

function PeriodButton({ number, className, onClick, schedule }) {
  const scheduleIcon = schedule ? getScheduleIcon(schedule.schedule) : null;

  return (
    <div className={`absolute z-20 ${className} w-[60px] h-[60px]`}>
      <button
        type="button"
        onClick={onClick}
        className={`w-[60px] h-[60px] rounded-full bg-white border-[2px] flex items-center justify-center cursor-pointer ${
          schedule ? "border-[#CFE8FF]" : "border-[#DBE7E8]"
        }`}
      >
        <div
          className={`w-[50px] h-[50px] rounded-full flex items-center justify-center ${
            schedule ? "bg-[#EAF8FF]" : "bg-[#DBE7E8]"
          }`}
        >
          {schedule && scheduleIcon ? (
            <img
              src={scheduleIcon}
              alt={schedule.schedule}
              className="w-[34px] h-[34px] object-contain pointer-events-none"
            />
          ) : schedule ? (
            <p className="text-[#65DBBE] text-xl font-semibold pointer-events-none">
              ✓
            </p>
          ) : (
            <p className="text-neutral-400 text-2xl font-semibold pointer-events-none">
              {number}
            </p>
          )}
        </div>
      </button>

      {schedule && (
        <div className="absolute z-30 top-[52px] left-1/2 -translate-x-1/2 min-w-[74px] rounded-[8px] border-[2px] border-[#DAEEFF] bg-white px-[6px] py-[3px] flex flex-col items-center pointer-events-none">
          <p className="text-[10px] font-semibold text-stone-950 leading-[12px]">
            {String(schedule.month).padStart(2, "0")}.
            {String(schedule.date).padStart(2, "0")}
          </p>

          <p className="whitespace-nowrap text-sm font-semibold text-stone-950 leading-[18px]">
            {getScheduleText(schedule.person, schedule.schedule)}
          </p>
        </div>
      )}
    </div>
  );
}

export default function Stamp() {
  const navigate = useNavigate();

  const accessToken = useAuthStore((state) => state.accessToken);

  // RoutineStep에서 선택한 관리 주기
  const selectedPeriod =
    useOnboardingStore((state) => state.routine) || 7;

  // 선택한 주기에 맞는 지도 설정
  const periodConfig = STAMP_PERIOD_CONFIGS[selectedPeriod];

  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    const fetchSchedules = async () => {
      const userId = getUserIdFromToken(accessToken);

      if (!userId) {
        console.error("사용자 ID를 확인할 수 없습니다.");
        return;
      }

      try {
        const today = new Date();

        const scheduleRequests = periodConfig.periodNumbers.map(
          async ({ number }) => {
            const targetDate = new Date(today);

            targetDate.setDate(today.getDate() + (number - 4));

            try {
              const response = await getSchedulesByDate(
                userId,
                formatDate(targetDate),
              );

              const data = Array.isArray(response)
                ? response
                : (response?.data ?? []);

              if (data.length === 0) {
                return null;
              }

              const schedule = data[0];

              return {
                scheduleId: schedule.scheduleId ?? schedule.id,

                dayNumber: number,

                person:
                  companionLabelMap[schedule.companion] ?? schedule.companion,

                schedule:
                  categoryLabelMap[schedule.category] ?? schedule.category,

                month: targetDate.getMonth() + 1,

                date: targetDate.getDate(),
              };
            } catch (error) {
              console.error(
                `${formatDate(targetDate)} 일정 조회 실패:`,
                error,
              );

              return null;
            }
          },
        );

        const result = await Promise.all(scheduleRequests);

        setSchedules(result.filter(Boolean));
      } catch (error) {
        console.error("스탬프 일정 조회 실패:", error);
      }
    };

    fetchSchedules();
  }, [accessToken, selectedPeriod]);

  const handlePeriodClick = (selectedDay, registeredSchedule) => {
    if (registeredSchedule) {
      navigate("/register", {
        state: {
          selectedDay,
          schedule: registeredSchedule,
        },
      });

      return;
    }

    navigate("/register-loading", {
      state: {
        selectedDay,
      },
    });
  };

  return (
    <div>
      <WeatherTipSection />

      <WeekCalenderSection />

      <p className="text-stone-950 text-lg font-medium mt-[30px] ml-[18px]">
        목표까지{" "}
        <span className="logo-font text-lg font-semibold text-stone-950">
          D-{periodConfig.dDay}
        </span>
      </p>

      <div className="w-32 h-3.5 bg-emerald-300/40 ml-[11px] -mt-[15px]" />

      <main
        className="relative ml-[10px]"
        style={{
          height: `${periodConfig.mapHeight}px`,
          marginTop: `${periodConfig.mapMarginTop ?? 0}px`,
        }}
      >
        {/* 주기별 지도 */}
        <img
          src={periodConfig.mapImage}
          alt={`${selectedPeriod}일 미션 지도`}
          className="relative z-0 mx-auto max-w-none h-auto pointer-events-none"
          style={{
            width: `${periodConfig.mapWidth}px`,
          }}
        />

        {/* 1 ~ 3일 완료 스탬프 */}
        {periodConfig.stampPositions.map((position, index) => (
          <img
            key={index}
            src={stamp}
            alt={`${index + 1}일차 스탬프`}
            className={`absolute z-10 ${position} pointer-events-none`}
          />
        ))}

        {/* 현재 위치 GO */}
        <div
          className={`absolute z-10 ${periodConfig.goClassName} rounded-[50px] w-[60px] h-[60px] bg-white border-[2px] border-[#2E4972] flex items-center justify-center pointer-events-none`}
        >
          <div className="w-[50px] h-[50px] rounded-[50px] bg-[#2E4972] flex justify-center items-center">
            <p className="text-white text-xl font-semibold">GO</p>
          </div>
        </div>

        {/* 일정 등록 가능한 날짜 */}
        {periodConfig.periodNumbers.map((item) => {
          const registeredSchedule = schedules.find(
            (schedule) => schedule.dayNumber === item.number,
          );

          return (
            <PeriodButton
              key={item.number}
              number={item.number}
              className={item.className}
              schedule={registeredSchedule}
              onClick={() =>
                handlePeriodClick(item.number, registeredSchedule)
              }
            />
          );
        })}

        {/* 마지막 목표 날짜 */}
        <div
          className={`absolute z-10 ${periodConfig.goalClassName} rounded-[50px] w-[90px] h-[90px] bg-white border-[2px] border-[#64DDCD] flex items-center justify-center pointer-events-none`}
        >
          <div className="w-[80px] h-[80px] rounded-[50px] bg-[#64DDCD] flex justify-center items-center">
            <p className="text-white text-4xl font-semibold">
              {periodConfig.goalDay}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}