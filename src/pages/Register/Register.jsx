import backButton from "../../assets/images/back_button.svg";
import registerCalendar from "../../assets/images/register_calendar.svg";

import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

import useScheduleStore from "../../store/useScheduleStore";

function OptionButton({ title, onClick, isSelected }) {
  return (
    <button
      onClick={onClick}
      className={`min-w-[60px] h-9 rounded-lg outline-1 outline-offset-[-1px] outline-stone-300
        pt-[7px] pb-[8px] pl-[14px] pr-[14px] cursor-pointer
        ${
          isSelected
            ? "bg-[#65DBBE] text-white"
            : "outline-stone-300 hover:bg-[#65DBBE] hover:text-white"
        }
      `}
    >
      {title}
    </button>
  );
}

function RegisterButton({ onClick }) {
  return (
    <div className="fixed bottom-[29px] left-[565px]" onClick={onClick}>
      <button
        type="button"
        className="cursor-pointer w-[332px] h-[52px] bg-emerald-300 rounded-[20px] text-white text-lg font-semibold"
      >
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
  ["이벤트", "친목/수다", "생일"],
];

export default function Register() {
  const navigate = useNavigate();

  const { state } = useLocation();

  const selectedDay = state?.selectedDay;

  const [selectedPerson, setSelectedPerson] = useState("");
  const [selectedSchedule, setSelectedSchedule] = useState("");

  const goDay = 4;

  const daysToAdd = selectedDay ? selectedDay - goDay : 0;

  const today = new Date();
  const selectedDate = new Date(today);
  selectedDate.setDate(today.getDate() + daysToAdd);
  const month = selectedDate.getMonth() + 1;
  const date = selectedDate.getDate();
  const dayList = ["일", "월", "화", "수", "목", "금", "토"];
  const day = dayList[selectedDate.getDay()];

  const getPersonText = () => {
    if (!selectedPerson) return "";

    if (selectedPerson === "직장동료" || selectedPerson === "친구") {
      return `${selectedPerson}와의`;
    }

    return `${selectedPerson}과의`;
  };

  const getScheduleParticle = () => {
    const useIe = ["미팅/면접", "술자리모임", "결혼식", "여행", "생일"];

    return useIe.includes(selectedSchedule) ? "이" : "가";
  };

  const getScheduleHeadline = () => {
    if (!selectedPerson) {
      return <>일정이 잡혀있네요!</>;
    }

    if (!selectedSchedule) {
      return (
        <>
          <span className="text-[#65DBBE]">{getPersonText()}</span> 일정이
          잡혀있네요!
        </>
      );
    }

    return (
      <>
        <span className="text-[#65DBBE]">
          {getPersonText()} {selectedSchedule}
        </span>
        {getScheduleParticle()} 잡혀있네요!
      </>
    );
  };

  const addSchedule = useScheduleStore((state) => state.addSchedule);

  const handleRegister = () => {
    if (!selectedPerson || !selectedSchedule) {
      alert("사람과 일정 옵션을 모두 선택해주세요!");

      return;
    }

    addSchedule({
      dayNumber: selectedDay,
      person: selectedPerson,
      schedule: selectedSchedule,
      month,
      date,
      day,
      dateText: `${month}월 ${date}일 ${day}요일`,
    });

    navigate("/stamp");
  };

  return (
    <div>
      <img
        src={backButton}
        className="ml-[14px] mt-[30px] cursor-pointer"
        onClick={() => navigate(-1)}
      />

      <header className="flex flex-col mt-9 ml-4 gap-[6px]">
        <section className="flex gap-[4px] items-center">
          <img src={registerCalendar} />
          <p className="text-[#A8A8A8] text-base font-medium">
            {month}월 {date}일 {day}요일
          </p>
        </section>

        <p className="text-zinc-900 text-2xl font-semibold">
          {getScheduleHeadline()}
        </p>
      </header>

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
                  onClick={() => setSelectedPerson(option)}
                  isSelected={selectedPerson === option}
                />
              ))}
            </div>
          ))}
        </section>
      </main>

      <main className="flex flex-col mt-[46px] ml-4 gap-[22px]">
        <p className="text-black text-lg font-bold">어떤 일정이 있으신가요?</p>

        <section className="flex flex-col gap-[10px]">
          {scheduleOptions.map((row, index) => (
            <div key={index} className="flex gap-[10px]">
              {row.map((option) => (
                <OptionButton
                  key={option}
                  title={option}
                  onClick={() => setSelectedSchedule(option)}
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
