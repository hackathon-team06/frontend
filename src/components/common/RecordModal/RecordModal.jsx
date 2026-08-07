import nextButton from "../../../assets/images/next_button.svg";
import prevButton from "../../../assets/images/prev_button.svg";
import { records } from "../../../constants/recordData";
import { useState } from "react";

export default function RecordModal({ onClose, recordList = records, date }) {
  const [page, setPage] = useState(0);

  const record = recordList[page];

  const recordDate = new Date();
  recordDate.setDate(recordDate.getDate() - 2);

  const showingDate =
    date ?? `${recordDate.getMonth() + 1}/${recordDate.getDate()}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-[1.5px]"
      onClick={onClose}
    >
      <div
        className="relative flex items-center gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 저녁 일지 : 이전 버튼을 누르면 아침 일지로 이동 */}
        {page === 1 && (
          <img
            src={prevButton}
            className="cursor-pointer absolute top-1/2 -translate-y-1/2 -left-9"
            onClick={() => setPage(0)}
          />
        )}

        <div className="w-[306px] h-[370px] rounded-2xl bg-white outline-[3px] outline-[#78BAA9] outline-offset-[-1.5px]">
          <main className="flex flex-col">
            <header className="flex justify-between">
              <p className="mt-[30px] ml-[14px] text-base font-semibold text-[#78BAA9]">
                {record.title}
              </p>
              <p className="logo-font mt-[30px] mr-[21px]">{showingDate}</p>
            </header>

            <p className="mt-9 ml-[14px] mr-[14px] whitespace-pre-line text-base font-semibold leading-5 text-stone-950">
              {record.description}
            </p>

            {record.missions.map((mission, index) => (
              <p
                key={index}
                className="mt-6 ml-[14px] mr-[14px] whitespace-pre-line text-base font-medium text-stone-950"
              >
                {mission}
              </p>
            ))}
          </main>
        </div>
        {/* 아침 일지 : 다음 버튼을 누르면 저녁 일지로 이동 */}
        {page === 0 && (
          <img
            src={nextButton}
            className="cursor-pointer absolute top-1/2 -translate-y-1/2 -right-9"
            onClick={() => setPage(1)}
          />
        )}
      </div>
    </div>
  );
}
