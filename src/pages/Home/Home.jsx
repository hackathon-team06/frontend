import checkIcon from "../../assets/icons/check_icon.svg";
import uncheckIcon from "../../assets/icons/uncheck_icon.svg";
import map from "../../assets/images/map.svg";
import stamp from "../../assets/icons/stamp_icon.svg";
import scheduleIcon from "../../assets/icons/schedule_icon.svg";

import MissionButton from "../../components/common/MissionButton/MissionButton";
import RecordModal from "../../components/common/RecordModal/RecordModal";

import { useNavigate } from "react-router-dom";
import { useState } from "react";

import useScheduleStore from "../../store/useScheduleStore";

const week = [
  { day: "월", checked: true },
  { day: "화", checked: true },
  { day: "수", checked: true },
  { day: "목", checked: false },
  { day: "금", checked: false },
  { day: "토", checked: false },
  { day: "일", checked: false },
];

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

{/* 마지막 글자에 받침이 있는지 확인하는 함수 */}
const hasFinalConsonant = (word) => {
  const lastChar = word[word.length - 1];

  // 한글이 아니면 받침 없음
  if (!/[가-힣]/.test(lastChar)) return false;

  const code = lastChar.charCodeAt(0) - 0xac00;

  return code % 28 !== 0;
};

{/* 일정 문구 생성 함수 */}
const getScheduleText = (person, schedule) => {
  
  if (schedule === "결혼식") {
    return `${person}의 ${schedule}`;
  }

  {/* 나머지는 받침에 따라 와/과 자동 선택 */}
  const particle = hasFinalConsonant(person) ? "과" : "와";

  return `${person}${particle} ${schedule}`;
};

function PeriodButton({ number, className, onClick, schedule }) {
  return (
    <div className={`absolute ${className} flex flex-col items-center`}>
      <button
        className="w-[60px] h-[60px] rounded-full bg-white border-[2px] border-[#DBE7E8] flex items-center justify-center cursor-pointer"
        onClick={onClick}
      >
        {schedule ? (
          <img src={scheduleIcon} className="object-contain" />
        ) : (
          <div className="w-[50px] h-[50px] rounded-full bg-[#DBE7E8] flex items-center justify-center">
            <p className="text-neutral-400 text-2xl font-semibold">{number}</p>
          </div>
        )}
      </button>

      {schedule && (
        <p className="mt-[4px] whitespace-nowrap rounded-[4px] border border-[#DAEEFF] bg-white px-[4px]  text-[10px] font-semibold text-stone-950">
          {getScheduleText(schedule.person, schedule.schedule)}
        </p>
      )}
    </div>
  );
}

export default function Home() {
  const today = new Date();

  const month = today.getMonth() + 1;
  const date = today.getDate();

  const dayList = ["일", "월", "화", "수", "목", "금", "토"];
  const day = dayList[today.getDay()];

  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const schedules = useScheduleStore((state) => state.schedules); // 등록하기 페이지에서 저장한 스케줄 불러오기

  return (
    <div className="relative">
      {/* 서비스명 + 오늘 날짜 */}
      <div className="ml-[18px] -mt-[50px]">
        <p className="logo-font text-[#65DBBE] text-emerald-300 text-xl font-normal mt-[92px]">
          stay care
        </p>
        <p className="text-stone-950 text-lg font-semibold mt-[30px]">
          {month}월&nbsp;{date}일&nbsp;({day})
        </p>
      </div>
      {/* 요일 + 체크 아이콘 */}
      <section className="flex gap-[18px] justify-center ml-[25px] mr-[27px] mt-3">
        {week.map((item) => {
          const isToday = item.day === day; // 오늘 요일에 초록 동그라미가 씌워지도록

          return (
            <div
              key={item.day}
              className="flex flex-col items-center gap-[5px]"
            >
              <p
                className={`flex w-6 h-6 items-center justify-center rounded-full text-sm font-semibold ${isToday ? "bg-[#65DBBE] text-white" : "text-stone-950"}`}
              >
                {item.day}
              </p>
              <img
                src={item.checked === true ? checkIcon : uncheckIcon}
                className="w-8 h-8"
              />
            </div>
          );
        })}
      </section>
      {/* 목표까지 남은 일수 */}
      <p className="text-stone-950 text-lg font-medium mt-[30px] ml-[18px]">
        목표까지{" "}
        <span className="logo-font text-lg font-semibold text-stone-950">
          D-11
        </span>
      </p>
      <div className="w-32 h-3.5 bg-emerald-300/40 ml-[11px] -mt-[15px]" />
      {/* 미션 지도 */}
      <main className="relative mt-13 ml-[27px] h-[540px]">
        <img src={map} />
        <img
          src={stamp}
          className="absolute -top-[22px] left-[30px] cursor-pointer"
        />
        <img
          src={stamp}
          className="absolute -top-[22px] left-[130px] cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        />
        <img
          src={stamp}
          className="absolute -top-[22px] left-[230px] cursor-pointer"
        />
        {/* Go 버튼 */}
        <div className="rounded-[50px] w-[60px] h-[60px] bg-white border-[2px] border-[#64DDCD] flex items-center justify-center absolute top-[65px] left-[180px]">
          <div className="w-[50px] h-[50px] rounded-[50px] bg-[#64DDCD] flex justify-center items-center">
            <p className="text-white text-xl font-semibold">GO</p>
          </div>
        </div>
        {/* 일반 숫자 버튼 */}
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
              onClick={() =>
                navigate("/register", {
                  state: { selectedDay: number.number },
                })
              }
            />
          );
        })}
        {/* 최종 주기 버튼 : 14일 */}
        <div className="rounded-[50px] w-[90px] h-[90px] bg-white border-[2px] border-[#64DDCD] flex items-center justify-center absolute top-[425px] left-[120px]">
          <div className="w-[80px] h-[80px] rounded-[50px] bg-[#64DDCD] flex justify-center items-center">
            <p className="text-white text-4xl font-semibold">14</p>
          </div>
        </div>
      </main>
      {/* 미션 수락하기 버튼 : 버튼을 클릭하면 미션 페이지로 이동 */}
      <MissionButton
        title="미션 수락하기"
        onClick={() => navigate("/mission")}
      />
      {isModalOpen && <RecordModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}
