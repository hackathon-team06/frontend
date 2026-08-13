import { useRef, useState } from "react";
import OnboardingButton from "../OnboardingButton/OnboardingButton";

export default function TimeModal({ onClose, onSelect, initialHour = "06", initialMinute = "00" }) {
  const hours = [];
  const minutes = [];

  // 시간 : 00 ~ 24
  for (let i = 0; i <= 24; i++) {
    hours.push(String(i).padStart(2, "0"));
  }

  // 분 : 00 ~ 59
  for (let i = 0; i <= 59; i++) {
    minutes.push(String(i).padStart(2, "0"));
  }

  const [selectedHour, setSelectedHour] = useState(initialHour);
  const [selectedMinute, setSelectedMinute] = useState(initialMinute);

  // 드래그
  const startYRef = useRef(0);
  const currentYRef = useRef(0);

  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // 드래그 시작
  const handleDragStart = (clientY) => {
    startYRef.current = clientY;
    currentYRef.current = clientY;

    setIsDragging(true);
  };

  // 드래그 중
  const handleDragMove = (clientY) => {
    if (!isDragging) return;

    currentYRef.current = clientY;

    const distance = clientY - startYRef.current;

    // 아래 방향으로만 움직이게
    if (distance > 0) {
      setDragY(distance);
    }
  };

  // 드래그 종료
  const handleDragEnd = () => {
    if (!isDragging) return;

    const distance = currentYRef.current - startYRef.current;

    // 90px 이상 아래로 내리면 닫기
    if (distance > 90) {
      onClose();
      return;
    }

    // 90px보다 적으면 다시 원래 위치로
    setDragY(0);
    setIsDragging(false);
  };

  // 시간 영역 스크롤
  const handleHourScroll = (e) => {
    const index = Math.round(e.currentTarget.scrollTop / 40);
    const hour = hours[index];

    if (hour) {
      setSelectedHour(hour);
    }
  };

  // 분 영역 스크롤
  const handleMinuteScroll = (e) => {
    const index = Math.round(e.currentTarget.scrollTop / 40);
    const minute = minutes[index];

    if (minute) {
      setSelectedMinute(minute);
    }
  };

  // 선택하기
  const handleSelect = () => {
    onSelect(selectedHour, selectedMinute);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      onClick={onClose}
    >
      <div className="relative h-full w-[390px]">
        <div className="absolute inset-0 z-0 bg-black/20" />
        <main
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-0 left-0 z-10 flex h-[376px] w-[390px] flex-col items-center rounded-tl-[29px] rounded-tr-[29px] bg-white shadow-[0px_0px_7.300000190734863px_0px_rgba(0,0,0,0.25)] animate-[slideUp_0.3s_ease-out]"
          style={{
            transform: `translateY(${dragY}px)`,
            transition: isDragging ? "none" : "transform 0.2s ease-out",
          }}
        >
          {/* 드래그 바 */}
          <div
            className="mt-[9px] flex h-[18px] w-24 cursor-grab touch-none items-start justify-center active:cursor-grabbing"
            onMouseDown={(e) => handleDragStart(e.clientY)}
            onMouseMove={(e) => handleDragMove(e.clientY)}
            onMouseUp={handleDragEnd}
            onMouseLeave={() => {
              if (isDragging) {
                handleDragEnd();
              }
            }}
            onTouchStart={(e) => handleDragStart(e.touches[0].clientY)}
            onTouchMove={(e) => handleDragMove(e.touches[0].clientY)}
            onTouchEnd={handleDragEnd}
          >
            <div className="h-[4px] w-20 rounded-[10px] bg-[#EFEFEF]" />
          </div>

          <p className="mt-[29px] text-xl font-semibold leading-6 text-zinc-900">
            시간 선택
          </p>

          <div className="mt-[20px] flex h-[150px] items-center justify-center gap-[22px]">
            {/* 시간 */}
            <div className="relative h-[150px] w-[72px]">
              {/* 선택 영역 회색 박스 */}
              <div className="pointer-events-none absolute top-[55px] left-0 z-0 h-10 w-[72px] rounded-[10px] bg-[#F4F4F4]" />

              <div
                onScroll={handleHourScroll}
                className="relative z-10 h-[150px] w-[72px] snap-y snap-mandatory overflow-y-scroll scroll-smooth py-[55px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {hours.map((hour) => (
                  <button
                    key={hour}
                    onClick={() => setSelectedHour(hour)}
                    className={`block h-[40px] w-full snap-center text-xl font-medium leading-8 transition-opacity duration-150 ${
                      selectedHour === hour
                        ? "text-zinc-700 opacity-100"
                        : "text-neutral-400 opacity-35"
                    }`}
                  >
                    {hour}
                  </button>
                ))}
              </div>
            </div>

            {/* 분 */}
            <div className="relative h-[150px] w-[72px]">
              {/* 선택 영역 회색 박스 */}
              <div className="pointer-events-none absolute top-[55px] left-0 z-0 h-10 w-[72px] rounded-[10px] bg-[#F4F4F4]" />

              <div
                onScroll={handleMinuteScroll}
                className="relative z-10 h-[150px] w-[72px] snap-y snap-mandatory overflow-y-scroll scroll-smooth py-[55px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {minutes.map((minute) => (
                  <button
                    key={minute}
                    onClick={() => setSelectedMinute(minute)}
                    className={`block h-[40px] w-full snap-center text-xl font-medium leading-8 transition-opacity duration-150 ${
                      selectedMinute === minute
                        ? "text-zinc-700 opacity-100"
                        : "text-neutral-400 opacity-35"
                    }`}
                  >
                    {minute}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div onClick={handleSelect}>
            <OnboardingButton title="선택하기" />
          </div>
        </main>
      </div>
    </div>
  );
}
