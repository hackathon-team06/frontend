import backButton from "../../assets/images/back_button.svg";

import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

import useScheduleStore from "../../store/useScheduleStore";

{/* 선택 가능한 옵션 버튼 */}
function OptionButton({ title, onClick, isSelected }) {
  return (
    <button
      onClick={onClick}
      className={`min-w-[60px] h-9 rounded-lg outline-1 outline-offset-[-1px] outline-stone-300
            pt-[7px] pb-[8px] pl-[14px] pr-[14px] cursor-pointer 
            ${isSelected ? "bg-[#65DBBE] text-white" : "outline-stone-300 hover:bg-[#65DBBE] hover:text-white"}
            `}
    >
      {title}
    </button>
  );
}

{/* 일정 등록하기 버튼 */}
function RegisterButton({ onClick }) {
  return (
    <div className="fixed bottom-[29px] left-[565px]" onClick={onClick}>
      <button className="cursor-pointer hover:bg-[#4FCFAF] w-[332px] h-[52px] bg-emerald-300 rounded-[20px] text-black text-lg font-semibold">
        일정 등록하기
      </button>
    </div>
  );
}

const peopleOptions = [
  ["연인", "직장동료", "친구"],
  ["가족/친척", "지인/모임"],
];

const scheduleOptions = [
  ["데이트", "미팅/면접", "자기관리"],
  ["술자리모임", "여행", "결혼식"],
  ["이벤트", "친목/수다", "행사"],
];

export default function Register() {
  const navigate = useNavigate();

  const [selectedPerson, setSelectedPerson] = useState(""); // 사람 옵션 선택 상태 관리
  const [selectedSchedule, setSelectedSchedule] = useState(""); // 일정 옵션 선택 상태 관리

  {/* Home 에서 일자를 선택했을 때 그에 맞게끔 목표까지 남은 일수가 뜨게 하기 위해서 */}
  const { state } = useLocation();
  const selectedDay = state?.selectedDay;
  const currentSteps = 15 - selectedDay;

  const stringNumbers = ["", "한", "두", "세", "네", "다섯", "여섯", "일곱", "여덟", "아홉", "열"];

  {/* Home 에서 일자를 선택한 후 등록하기 페이지의 날짜가 오늘 날짜 기준으로 계산 돼서 뜨도록 */}
  const goDay = 4;
  const daysToAdd = selectedDay ? selectedDay - goDay : 0;

  const today = new Date();

  const selectedDate = new Date(today);
  selectedDate.setDate(today.getDate() + daysToAdd);

  const month = selectedDate.getMonth() + 1;
  const date = selectedDate.getDate();
  const dayList = ["일", "월", "화", "수", "목", "금", "토"];
  const day = dayList[selectedDate.getDay()];

  const addSchedule = useScheduleStore((state) => state.addSchedule);

  {/* 등록하기 함수 */}
  const handleRegister = () => {
    if (!selectedPerson || !selectedSchedule) {
      alert("사람과 일정 옵션을 모두 선택해주세요!");
      return;
    }

    addSchedule({
      dayNumber: selectedDay,
      person: selectedPerson,
      schedule: selectedSchedule,
    });

    navigate("/home");
  };

  return (
    <div>
      <img
        src={backButton}
        className="ml-[14px] mt-[30px] cursor-pointer"
        onClick={() => navigate("/home")}
      />
      <header className="flex flex-col mt-9 ml-4 gap-[13px]">
        <p className="text-black text-xl font-semibold">
          {month}월&nbsp;{date}일&nbsp;{day}요일
        </p>
        <p className="text-stone-950 text-sm font-normal">
          목표까지{" "}
          <span className="text-emerald-300 text-sm font-normal">
            {stringNumbers[currentSteps]}
          </span>
          걸음
        </p>
      </header>
      {/* 사람 옵션 선택 */}
      <main className="flex flex-col mt-[46px] ml-4 gap-[22px]">
        <p className="text-black text-lg font-bold">
          누구랑 약속이 있으신가요?
        </p>
        <section className="flex flex-col gap-[10px]">
          {peopleOptions.map((row, index) => (
            <div key={index} className="flex gap-[10px]">
              {row.map((option) => (
                <OptionButton
                  key={option}
                  title={option}
                  onClick={() => {
                    setSelectedPerson(option);
                    console.log(option);
                  }}
                  isSelected={selectedPerson === option}
                />
              ))}
            </div>
          ))}
        </section>
      </main>
      {/* 일정 옵션 선택 */}
      <main className="flex flex-col mt-[46px] ml-4 gap-[22px]">
        <p className="text-black text-lg font-bold">어떤 일정이 있으신가요?</p>
        <section className="flex flex-col gap-[10px]">
          {scheduleOptions.map((row, index) => (
            <div key={index} className="flex gap-[10px]">
              {row.map((option) => (
                <OptionButton
                  key={option}
                  title={option}
                  onClick={() => {
                    setSelectedSchedule(option);
                    console.log(option);
                  }}
                  isSelected={selectedSchedule === option}
                />
              ))}
            </div>
          ))}
        </section>
      </main>
      <RegisterButton onClick={handleRegister} />
    </div>
  );
}
