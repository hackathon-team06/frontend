import { useRef, useState } from "react";
import skipCharacter from "../../../assets/icons/skip_icon.svg";

export default function SkipModal({ onClose, onSkip, onContinue }) {
  const startYRef = useRef(0);
  const currentYRef = useRef(0);

  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isConfirmingSkip, setIsConfirmingSkip] = useState(false);

  const handleDragStart = (clientY) => {
    startYRef.current = clientY;
    currentYRef.current = clientY;
    setIsDragging(true);
  };

  const handleDragMove = (clientY) => {
    if (!isDragging) return;

    currentYRef.current = clientY;

    const distance = clientY - startYRef.current;

    if (distance > 0) {
      setDragY(distance);
    }
  };

  const handleDragEnd = () => {
    if (!isDragging) return;

    const distance = currentYRef.current - startYRef.current;

    if (distance > 90) {
      onClose();
      return;
    }

    setDragY(0);
    setIsDragging(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      onClick={onClose}
    >
      <div className="relative h-full w-[390px]">
        <div className="absolute inset-0 bg-black/20" />

        <main
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-0 left-0 z-10 flex h-[376px] w-[390px] flex-col items-center rounded-t-[29px] bg-white shadow-[0px_0px_7.3px_0px_rgba(0,0,0,0.25)] animate-[slideUp_0.3s_ease-out]"
          style={{
            transform: `translateY(${dragY}px)`,
            transition: isDragging ? "none" : "transform 0.2s ease-out",
          }}
        >
          {/* 회색 드래그 바 */}
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

          {/* 캐릭터 */}
          <img src={skipCharacter} className="mt-[59px]" />

          {!isConfirmingSkip ? (
            <>
              {/* 기본 문구 */}
              <p className="mt-6 text-2xl font-semibold leading-8 text-zinc-900">
                지금은 건너뛸까요?
              </p>

              <p className="mt-2 text-xs font-medium leading-5 text-neutral-400">
                정보 입력 완료 시 +10P
              </p>

              {/* 기본 버튼 */}
              <div className="absolute bottom-[27px] flex gap-3">
                <button
                  onClick={() => setIsConfirmingSkip(true)}
                  className="h-[57px] w-[166px] cursor-pointer rounded-lg bg-[#F5F5F5] text-base font-medium text-[#A8A8A8]"
                >
                  지금은 건너뛰기
                </button>

                <button
                  onClick={onContinue}
                  className="h-[57px] w-[166px] cursor-pointer rounded-lg bg-[#65DBBE] text-base font-semibold text-white"
                >
                  계속 입력하기 +10P
                </button>
              </div>
            </>
          ) : (
            <>
              {/* 건너뛰기 확인 문구 */}
              <p className="mt-6 text-center text-2xl font-semibold leading-8 text-zinc-900">
                정말 건너뛰시겠습니까?
              </p>

              <p className="mt-2 text-center text-xs font-medium leading-5 text-neutral-400">
                건너뛰어도 마이페이지에서 언제든 다시 입력할 수 있어요!
              </p>

              {/* 확인 버튼 */}
              <div className="absolute bottom-[27px] flex gap-3 ">
                <button
                  onClick={onSkip}
                  className="h-[57px] w-[166px] cursor-pointer rounded-lg bg-[#F5F5F5] text-base font-medium text-[#A8A8A8]"
                >
                  네, 건너뛸게요
                </button>

                <button
                  onClick={onContinue}
                  className="h-[57px] w-[166px] cursor-pointer rounded-lg bg-[#65DBBE] text-base font-semibold text-white"
                >
                  계속 입력할게요
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}