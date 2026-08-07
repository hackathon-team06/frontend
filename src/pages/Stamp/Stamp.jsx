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

  const totalPoint = stampList.reduce(
    (sum, item) => sum + (item.point || 0),
    0,
  );

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
      <div className="mt-[34px] w-80 h-6 relative rounded-3xl outline-1 outline-offset-[-1px] outline-white"></div>
      <div className="w-90 grid grid-cols-7 items-center">
        {week.map((day) => (
          <span
            key={day}
            className="text-center text-stone-950 text-sm font-semibold"
          >
            {day}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-[18px] mt-[19px]">
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
      <div className="flex gap-[124px] mt-[46px] mb-[30px]">
        <section className="flex flex-col gap-[11px]">
          <div className="flex gap-[20px] items-center">
            <div className="w-4 h-4 rounded-full bg-[#65DBBE]" />
            <p className="text-stone-950 text-sm font-medium">전체 성공</p>
          </div>
          <div className="flex gap-[20px] items-center">
            <div className="w-4 h-4 rounded-full bg-[#9AFFC1]" />
            <p className="text-stone-950 text-sm font-medium">일부 성공</p>
          </div>
        </section>
        <p className="text-black text-sm font-medium">
          총 얻은 포인트 : {totalPoint}P
        </p>
      </div>
      <p className="self-start text-black text-lg font-medium ml-[22px]">
        미션 진행도
      </p>
      <div className="relative mt-[18px] mb-[50px] w-[354px] h-[24px] outline-1 outline-offset-[-1px] outline-emerald-200 rounded-3xl">
        <div className="absolute left-0 top-0 w-[177px] h-[24px] bg-gradient-to-r from-emerald-200 to-emerald-300 rounded-3xl">
          <p className="ml-[7px] mt-[3px] text-white text-xs font-medium">
            46%
          </p>
        </div>
        <p className="absolute right-0 top-0 text-black text-sm font-medium mr-[10px] mt-[2px]">
          13/28
        </p>
      </div>
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