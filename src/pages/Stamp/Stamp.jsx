import stampList from "../../constants/mypageStamp";
import StampDay from "../../components/common/StampDay/StampDay";
import { stampRecords } from "../../constants/recordData";
import RecordModal from "../../components/common/RecordModal/RecordModal";
import backButton from "../../assets/images/prev_button.svg";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Stamp() {
  const week = ["일", "월", "화", "수", "목", "금", "토"];

  const calendar = [null, null, null, null, null, ...stampList];

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDayClick = (day) => {
    if (day === 14) {
      setIsModalOpen(true);
    }
  };

  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center">
      <img
        src={backButton}
        className="absolute w-9 h-9 left-2 top-4 cursor-pointer"
        onClick={() => navigate("/mypage")}
      />
      <p className="text-black text-2xl font-medium mt-[63px]">5월</p>
      <div className="w-90 grid grid-cols-7 items-center mt-[65px]">
        {week.map((day) => (
          <span
            key={day}
            className="text-center text-stone-950 text-sm font-semibold"
          >
            {day}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-x-[18px] gap-y-[30px] mt-[30px]">
        {calendar.map((item, index) =>
          item ? (
            <div
              key={item.day}
              onClick={() => handleDayClick(item.day)}
              className={item.day === 14 ? "cursor-pointer" : ""}
            >
              <StampDay
                day={item.day}
                status={item.status}
                point={item.point}
              />
            </div>
          ) : (
            <div key={index}></div>
          ),
        )}
      </div>
      <p className="mt-8 self-end mr-[19px] text-black text-sm font-semibold">총 168개 중 104개 완료</p>
      {/* 포인트 박스 부분 */}
      <section className="relative mt-[35px] mb-[84px] w-[352px] h-[114px] bg-white rounded-[10px] shadow-[0px_2px_2px_0px_rgba(149,179,151,0.25)] outline-1 outline-offset-[-1px] outline-teal-300">
        <div className="flex flex-col mt-4 ml-[10px]">
          <div className="flex gap-[22px]">
            <p className="text-stone-950 text-sm font-semibold">일일 포인트</p>
            <p className="text-[#64DDCD] text-sm font-semibold">+117</p>
          </div>
          <div className="flex gap-[22px] mt-[7px]">
            <p className="text-stone-950 text-sm font-semibold">완료 포인트</p>
            <p className="text-[#64DDCD] text-sm font-semibold">+41</p>
          </div>
          <div className="w-[148px] h-[1px] bg-[#C3C3C3] mt-[14px]" />
          <p className="mt-[10px] text-stone-950 text-sm font-semibold">총 얻은 포인트 : <span className="text-teal-300 text-sm font-semibold">158</span>P</p>
        </div>
        {/* 전부 성공 */}
        <div className="absolute right-5 bottom-[59px] flex gap-2 items-center">
          <div className="size-3 bg-teal-300 rounded-full" />
          <p className="text-stone-950 text-xs font-medium">전부 성공</p>
        </div>
        {/* 일부 성공 */}
        <div className="absolute right-5 bottom-[35px] flex gap-2 items-center">
          <div className="size-3 bg-[#A0F8E2] rounded-full" />
          <p className="text-stone-950 text-xs font-medium">일부 성공</p>
        </div>
        {/* 미참여 */}
        <div className="absolute right-[33px] bottom-[11px] flex gap-2 items-center">
          <div className="size-3 bg-[#DBE7E8] rounded-full" />
          <p className="text-[#777777] text-xs font-medium">미참여</p>
        </div>
      </section>
      {isModalOpen && (
        <RecordModal
          recordList={stampRecords}
          date="5/14"
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
