import WeatherTipSection from "../../components/home/WeatherTipSection";
import WeekCalenderSection from "../../components/home/WeekCalendarSection";
import map from "../../assets/images/map.svg";
import stamp from "../../assets/images/home_stamp.svg";
import useScheduleStore from "../../store/useScheduleStore";
import StampProgressBtn from "../../components/home/StampProgressBtn";
import { useNavigate } from "react-router-dom";

import alcoholIcon from "../../assets/icons/alcohol_icon.svg";
import birthdayIcon from "../../assets/icons/birthday_icon.svg";
import dateIcon from "../../assets/icons/date_icon.svg";
import weddingIcon from "../../assets/icons/wedding_icon.svg";
import travelIcon from "../../assets/icons/travel_icon.svg";
import meetingIcon from "../../assets/icons/meeting_icon.svg";
import selfcareIcon from "../../assets/icons/selfcare_icon.svg";
import eventIcon from "../../assets/icons/event_icon.svg";

const periodnumbers = [
  { number: 5, className: "top-[65px] left-[75px]" },
  { number: 6, className: "top-[155px] left-[30px]" },
  { number: 7, className: "top-[155px] left-[130px]" },
  { number: 8, className: "top-[155px] left-[230px]" },
  { number: 9, className: "top-[245px] left-[180px]" },
  { number: 10, className: "top-[245px] left-[80px]" },
  { number: 11, className: "top-[335px] left-[30px]" },
  { number: 12, className: "top-[335px] left-[135px]" },
  { number: 13, className: "top-[335px] left-[230px]" },
];

const hasFinalConsonant = (word) => {
  const lastChar = word[word.length - 1];

  if (!/[가-힣]/.test(lastChar)) return false;

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

  const schedules = useScheduleStore((state) => state.schedules);

  const handlePeriodClick = (selectedDay) => {
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
          D-11
        </span>
      </p>

      <div className="w-32 h-3.5 bg-emerald-300/40 ml-[11px] -mt-[15px]" />

      <main className="relative mt-13 ml-[27px] h-[540px]">
        <img
          src={map}
          alt="미션 지도"
          className="relative z-0 pointer-events-none"
        />

        <img
          src={stamp}
          alt="스탬프"
          className="absolute z-10 -top-[22px] left-[30px] pointer-events-none"
        />

        <img
          src={stamp}
          alt="스탬프"
          className="absolute z-10 -top-[22px] left-[130px] pointer-events-none"
        />

        <img
          src={stamp}
          alt="스탬프"
          className="absolute z-10 -top-[22px] left-[230px] pointer-events-none"
        />

        <div className="absolute z-10 top-[65px] left-[180px] rounded-[50px] w-[60px] h-[60px] bg-white border-[2px] border-[#2E4972] flex items-center justify-center pointer-events-none">
          <div className="w-[50px] h-[50px] rounded-[50px] bg-[#2E4972] flex justify-center items-center">
            <p className="text-white text-xl font-semibold">GO</p>
          </div>
        </div>

        {periodnumbers.map((number) => {
          const registeredSchedule = schedules.find(
            (schedule) => schedule.dayNumber === number.number,
          );

          return (
            <PeriodButton
              key={number.number}
              number={number.number}
              className={number.className}
              schedule={registeredSchedule}
              onClick={() => handlePeriodClick(number.number)}
            />
          );
        })}

        <div className="absolute z-10 top-[425px] left-[120px] rounded-[50px] w-[90px] h-[90px] bg-white border-[2px] border-[#64DDCD] flex items-center justify-center pointer-events-none">
          <div className="w-[80px] h-[80px] rounded-[50px] bg-[#64DDCD] flex justify-center items-center">
            <p className="text-white text-4xl font-semibold">14</p>
          </div>
        </div>
      </main>

      <StampProgressBtn title="미션 수락하기" />
    </div>
  );
}