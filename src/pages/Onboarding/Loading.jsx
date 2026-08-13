import { useEffect, useState } from "react";

import loadingCharacter from "../../assets/images/loading_character.svg";
import waterIcon from "../../assets/icons/water_icon.svg";
import promiseIcon from "../../assets/icons/promise_icon.svg";
import restIcon from "../../assets/icons/rest_icon.svg";
import habitIcon from "../../assets/icons/habit_icon.svg";
import cupIcon from "../../assets/icons/cup_icon.svg";
import nutrientIcon from "../../assets/icons/nutrient_icon.svg";

const icons = [
  waterIcon,
  promiseIcon,
  restIcon,
  habitIcon,
  nutrientIcon,
  cupIcon,
];

const positions = [
  { top: 80, left: 75 },
  { top: 40, left: 145 },
  { top: 35, left: 215 },
  { top: 80, left: 280 },
  { top: 150, left: 325 },
  { top: 150, left: 30 },
];

export default function Loading({ onNext }) {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  // 5초 후 Result 페이지로 이동
  useEffect(() => {
    const timer = setTimeout(() => {
      onNext();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onNext]);

  // 아이콘 애니메이션
  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prevStep) => {
        const nextStep = prevStep + direction;

        // 끝까지 가면 반대 방향
        if (nextStep >= positions.length - 1) {
          setDirection(-1);
          return positions.length - 1;
        }

        // 처음까지 돌아오면 다시 정방향
        if (nextStep <= 0) {
          setDirection(1);
          return 0;
        }

        return nextStep;
      });
    }, 650);

    return () => clearInterval(timer);
  }, [direction]);

  return (
    <div className="relative min-h-[730px]">
      <div className="flex flex-col ml-[40px] mt-[105px]">
        <p className="text-cyan-900 text-3xl font-bold leading-[51.20px] tracking-wide">
          잠시만요,
          <br />
          <span className="text-cyan-900 text-2xl font-bold leading-10 tracking-wide">
            딱 맞는 미션
          </span>
          <span className="text-cyan-900 text-2xl font-semibold leading-10 tracking-wide">
            을 찾고 있어요!
          </span>
        </p>

        <p className="text-neutral-400 text-xs font-medium leading-5 tracking-tight">
          알려주신 정보를 바탕으로 오늘부터 함께할 미션을 준비할게요.
        </p>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-[430px]">

        {icons.map((icon, index) => {
          const position = positions[(index + step) % positions.length];

          return (
            <img
              key={index}
              src={icon}
              className="absolute w-[40px]"
              style={{
                top: `${position.top}px`,
                left: `${position.left}px`,
              }}
            />
          );
        })}

        <img
          src={loadingCharacter}
          className="absolute w-[220px] bottom-0 left-1/2 -translate-x-1/2"
        />
      </div>
    </div>
  );
}