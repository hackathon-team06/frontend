import backButton from "../../assets/images/back_button.svg";
import registerCalendar from "../../assets/images/register_calendar.svg";

import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

import {
  createSchedule,
  updateSchedule,
  deleteSchedule,
} from "../../api/schedule";

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

function RegisterButton({ onClick, title }) {
  return (
    <div
      className="fixed bottom-[29px] left-1/2 -translate-x-1/2"
      onClick={onClick}
    >
      <button className="cursor-pointer w-[332px] h-[52px] bg-emerald-300 rounded-[20px] text-white text-lg font-semibold">
        {title}
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

const peopleMap = {
  연인: "LOVER",
  직장동료: "COWORKER",
  친구: "FRIEND",
  "가족/친척": "FAMILY",
  "지인/모임": "ACQUAINTANCE",
};

const scheduleMap = {
  데이트: "DATE",
  "미팅/면접": "MEETING",
  자기관리: "SELF_CARE",
  술자리모임: "DRINKING",
  여행: "TRAVEL",
  결혼식: "WEDDING",
  이벤트: "EVENT",
  "친목/수다": "TALK",
  행사: "CEREMONY",
};

export default function Register() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const selectedDay = state?.selectedDay;
  const registeredSchedule = state?.schedule;

  const isEdit = Boolean(registeredSchedule?.scheduleId);

  const [selectedPerson, setSelectedPerson] = useState(
    registeredSchedule?.person ?? "",
  );

  const [selectedSchedule, setSelectedSchedule] = useState(
    registeredSchedule?.schedule ?? "",
  );

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
    const useIe = ["미팅/면접", "술자리모임", "결혼식", "여행"];

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

  const formatDate = (date) => {
    const year = date.getFullYear();

    const month = String(date.getMonth() + 1).padStart(2, "0");

    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const handleDelete = async () => {
    if (!isEdit) return;

    try {
      await deleteSchedule(registeredSchedule.scheduleId);

      navigate("/stamp");
    } catch (error) {
      console.error("일정 삭제 실패: ", error);
    }
  };

  const handleRegister = async () => {
    if (!selectedPerson || !selectedSchedule) {
      alert("사람과 일정 옵션을 모두 선택해주세요!");

      return;
    }

    const scheduleData = {
      title: `${selectedPerson} ${selectedSchedule}`,
      startDate: formatDate(selectedDate),
      endDate: formatDate(selectedDate),
      startTime: "09:00",
      endTime: "20:00",
      companion: peopleMap[selectedPerson],
      category: scheduleMap[selectedSchedule],
    };

    try {
      if (isEdit) {
        await updateSchedule(registeredSchedule.scheduleId, scheduleData);
      } else {
        await createSchedule(scheduleData);
      }

      navigate("/stamp");
    } catch (error) {
      console.error(isEdit ? "일정 수정 실패: " : "일정 등록 실패: ", error);
    }
  };

  return (
    <div>
      {/* 뒤로가기 / 삭제하기 */}
      <div className="mt-[30px] flex items-center justify-between px-[14px]">
        <img
          src={backButton}
          alt="뒤로가기"
          className="cursor-pointer"
          onClick={() => navigate(-1)}
        />

        {isEdit && (
          <button
            type="button"
            onClick={handleDelete}
            className="cursor-pointer text-sm font-medium text-[#A8A8A8]"
          >
            삭제하기
          </button>
        )}
      </div>

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

      <RegisterButton
        onClick={handleRegister}
        title={isEdit ? "일정 수정하기" : "일정 등록하기"}
      />
    </div>
  );
}
