// 내용 부분 이미지로 사용
import HomeImage from "../../assets/images/intro_home.svg";
import MorningMissionImage from "../../assets/images/intro_morning_mission.svg";
import EveningMissionImage from "../../assets/images/intro_evening_mission.svg";

export default function SecondIntro({ onClick }) {
  return (
    <>
      <div className="mt-11 pl-7.5">
        <div>
          <p className="text-emerald-300 text-sm font-semibold pb-2">
            일정마다 피부 신경쓰기 귀찮다면?
          </p>
          <p className="text-cyan-900 text-4xl font-semibold pb-1">
            케어가 챙겨드려요!
          </p>
          <p className="text-cyan-900 text-2xl font-bold">
            매일의 미션으로 습관화
          </p>
        </div>
        <div className="relative mt-3">
          <img src={HomeImage} alt="홈화면" />
          <img
            src={MorningMissionImage}
            alt="아침미션"
            className="absolute top-[17%] left-[46%]"
          />
          <img
            src={EveningMissionImage}
            alt="저녁미션"
            className="absolute top-[46%] left-[46%]"
          />
        </div>
      </div>
      <div className="flex gap-5.5 justify-center mt-7">
        <div className="size-2 rounded-xl bg-green-200" />
        <div className="size-2 rounded-xl bg-emerald-300" />
        <div className="size-2 rounded-xl bg-green-200" />
      </div>
      <div className="pl-66.5 mt-11.5">
        <button
          onClick={onClick}
          className="cursor-pointer text-cyan-900 text-xl font-semibold"
        >
          다음으로
        </button>
      </div>
    </>
  );
}
