import checkIcon from "../../assets/icons/check_icon.svg";
import uncheckIcon from "../../assets/icons/uncheck_icon.svg";
import map from "../../assets/images/map.svg";
import day1 from "../../assets/images/day1.svg";
import day2 from "../../assets/images/day2.svg";
import day3 from "../../assets/images/day3.svg";

import MissionButton from "../../components/common/MissionButton/MissionButton";

import { useNavigate } from "react-router-dom";
import { useState } from "react";

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

function PeriodButton({ number, className, onClick }) {
  return (
    <div
      className={`absolute ${className} rounded-[50px] w-[60px] h-[60px] bg-white border-[2px] border-[#DBE7E8] flex items-center justify-center cursor-pointer`}
      onClick={onClick}
    >
      <div className="w-[50px] h-[50px] rounded-[50px] bg-[#DBE7E8] flex justify-center items-center">
        <p className="text-neutral-400 text-2xl font-semibold">{number}</p>
      </div>
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
            <div className="flex flex-col items-center gap-[5px]">
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
          src={day1}
          className="absolute -top-[22px] left-[30px] cursor-pointer"
        />
        <img
          src={day2}
          className="absolute -top-[22px] left-[130px] cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        />
        <img
          src={day3}
          className="absolute -top-[22px] left-[230px] cursor-pointer"
        />
        {/* Go 버튼 */}
        <div className="rounded-[50px] w-[60px] h-[60px] bg-white border-[2px] border-[#64DDCD] flex items-center justify-center absolute top-[65px] left-[180px]">
          <div className="w-[50px] h-[50px] rounded-[50px] bg-[#64DDCD] flex justify-center items-center">
            <p className="text-white text-xl font-semibold">GO</p>
          </div>
        </div>
        {/* 일반 숫자 버튼 */}
        {periodnumbers.map((number) => (
          <PeriodButton
            key={number.number}
            number={number.number}
            className={number.className}
            onClick={() =>
              navigate("/register", { state: { selectedDay: number.number } })
            }
          />
        ))}
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
    </div>
  );
}
