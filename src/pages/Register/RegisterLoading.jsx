import { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import backButton from "../../assets/images/back_button.svg";
import registerCharacter from "../../assets/images/register_character.svg";
import startButton from "../../assets/images/start_button.svg";

import alcoholIcon from "../../assets/icons/alcohol_icon.svg";
import birthdayIcon from "../../assets/icons/birthday_icon.svg";
import dateIcon from "../../assets/icons/date_icon.svg";
import weddingIcon from "../../assets/icons/wedding_icon.svg";
import travelIcon from "../../assets/icons/travel_icon.svg";
import meetingIcon from "../../assets/icons/meeting_icon.svg";
import selfcareIcon from "../../assets/icons/selfcare_icon.svg";

const icons = [
  selfcareIcon,
  dateIcon,
  meetingIcon,
  weddingIcon,
  alcoholIcon,
  birthdayIcon,
  travelIcon,
];

const positions = [
  { top: 45, left: 25 },
  { top: 15, left: 82 },
  { top: 5, left: 149 },
  { top: 15, left: 216 },
  { top: 45, left: 277 },
  { top: 100, left: 293 },
  { top: 100, left: 5 },
];

export default function RegisterLoading() {
  const navigate = useNavigate();

  const { state } = useLocation();

  // Stamp에서 선택한 날짜
  const selectedDay =
    state?.selectedDay;

  const [step, setStep] =
    useState(0);

  const [
    direction,
    setDirection,
  ] = useState(1);

  // 아이콘 애니메이션
  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prevStep) => {
        const nextStep =
          prevStep + direction;

        if (
          nextStep >=
          positions.length - 1
        ) {
          setDirection(-1);

          return (
            positions.length - 1
          );
        }

        if (nextStep <= 0) {
          setDirection(1);

          return 0;
        }

        return nextStep;
      });
    }, 650);

    return () =>
      clearInterval(timer);
  }, [direction]);

  // Register로 이동하면서 selectedDay 그대로 전달
  const handleStart = () => {
    navigate("/register", {
      state: {
        selectedDay,
      },
    });
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-white">
      <img
        src={backButton}
        className="absolute top-[68px] left-[20px] cursor-pointer"
        onClick={() =>
          navigate(-1)
        }
      />

      <header className="flex flex-col gap-[15px] mt-[126px] ml-5">
        <p className="text-cyan-900 text-2xl font-semibold">
          일정만 등록해도, 미션이
          완성돼요!
        </p>

        <p className="text-cyan-900 text-lg font-medium">
          나만의 일정을 적어보세요.
        </p>
      </header>

      <section className="relative w-[340px] h-[390px] self-center mt-[170px]">
        {icons.map(
          (icon, index) => {
            const position =
              positions[
                (index + step) %
                  positions.length
              ];

            return (
              <img
                key={index}
                src={icon}
                alt=""
                className="absolute w-[40px]"
                style={{
                  top: `${position.top}px`,
                  left: `${position.left}px`,
                }}
              />
            );
          },
        )}

        <img
          src={registerCharacter}
          alt="일정 등록 캐릭터"
          className="absolute top-[90px] left-1/2 -translate-x-1/2 w-[217px] h-[288px]"
        />
      </section>

      <footer
        onClick={handleStart}
        className="absolute bottom-[38px] right-[18px] flex gap-[2px] items-center cursor-pointer"
      >
        <p className="text-cyan-900 text-xl font-semibold leading-8">
          시작하기
        </p>

        <img
          src={startButton}
        />
      </footer>
    </div>
  );
}