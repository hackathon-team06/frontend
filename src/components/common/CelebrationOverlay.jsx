import { useEffect } from "react";

import celebrateGlow from "../../assets/images/celebrate_glow.svg";
import pointBadgeLg from "../../assets/images/point_badge_lg.svg";

/** 자동으로 닫히기까지의 시간 */
const AUTO_CLOSE_DURATION = 3000;

/**
 * 축하 오버레이.
 *
 * 미션 성공, 캘린더 완료처럼 "해냈고 포인트를 받았다"를 알리는 화면입니다.
 * 디자인에 닫기 버튼이 없어 화면을 누르거나 3초가 지나면 닫힙니다.
 */
export default function CelebrationOverlay({ title, description, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, AUTO_CLOSE_DURATION);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-40 flex cursor-pointer justify-center"
      onClick={onClose}
    >
      <div className="relative flex h-full w-[390px] animate-[celebrateIn_0.3s_ease-out] flex-col items-center justify-center overflow-hidden">
        <img
          src={celebrateGlow}
          alt=""
          className="pointer-events-none absolute left-1/2 top-1/2 w-[677px] max-w-none -translate-x-1/2 -translate-y-1/2"
        />

        <div className="relative flex flex-col items-center gap-[4px]">
          <div className="flex flex-col items-center">
            <span className="relative inline-block size-[105px] animate-[badgePop_0.4s_0.1s_ease-out_backwards]">
              <img src={pointBadgeLg} alt="" className="absolute inset-0 size-[105px]" />
              <span className="absolute left-0 top-0 w-full text-center text-[90px] font-medium leading-[90px] text-mint-300">
                s
              </span>
            </span>

            <p className="text-[32px] font-bold leading-[1.6] tracking-[0.8px] text-[#2e4972]">
              {title}
            </p>

            <p className="text-center text-[20px] font-semibold leading-[1.6] tracking-[0.5px] text-[#2e4972]">
              {description}
            </p>
          </div>

          <p className="text-[12px] font-medium leading-[1.6] tracking-[0.3px] text-ink-400">
            포인트는 제품 칸에서 확인 가능합니다
          </p>
        </div>
      </div>
    </div>
  );
}
