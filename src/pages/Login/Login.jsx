import homeIcon from "../../assets/icons/home_icon.svg";
import character from "../../assets/images/character.svg";
import sparkle from "../../assets/images/sparkle.svg";

import LoginButton from "../../components/common/LoginButton/LoginButton";

import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="relative h-screen overflow-hidden">
      {/* 서비스명 + 한줄소개 */}
      <header className="relative flex flex-col items-center gap-[7px]">
        <div className="absolute top-[30px] w-[310px] h-[382px] bg-radial-[at_4%_57%] from-emerald-300/10 to-slate-600/10 blur-2xl" />
        <p className="logo-font text-[#65DBBE] text-5xl font-normal mt-[210px]">
          stay care
        </p>
        <p className="text-[#78BAA9] text-base font-bold">
          집에서 시작하는 작은 변화
        </p>
        <img src={homeIcon} className="absolute top-[173px] left-[88px]" />
        <img src={sparkle} className="absolute top-[168px] left-[289px]" />
        <img
          src={sparkle}
          className="absolute  w-[25px] h-[28px] top-[295px] left-[37px]"
        />
        <div className="absolute top-[200px] right-[50.36px] w-[9px] h-[9px] rotate-[135deg] bg-neutral-300/20 " />
        <div className="absolute top-[316px] left-[68px] w-[9px] h-[9px] rotate-[135deg] bg-neutral-300/20 " />
        <div className="absolute left-[40px] top-[100px] w-[310px] h-[382px]" />
      </header>
      <div className="absolute left-[130px] top-[400px] w-[228px] h-[72px] bg-white rounded-[100px] shadow-lg">
        <p className="mt-[3px] text-center leading-5 text-stone-300 text-base font-medium">
          매일 1분,
          <br />
          나를 위한 작은{" "}
          <span className="text-emerald-300 text-base font-semibold">케어</span>
          로<br /> 더 건강한 일상을 시작해요!
        </p>
        <div className="absolute right-[25px] bottom-[-18px] w-0 h-0 border-l-[18px] border-l-transparent border-r-[18px] border-r-transparent border-t-[22px] border-t-white" />
      </div>
      <img src={character} className="animate-character mt-[200px]" />
      <LoginButton
        title="테스트 계정으로 로그인"
        onClick={() => navigate("/onboarding")}
      />
      <div className="pointer-events-none absolute top-[420px] w-96 h-[550px] bg-radial-[at_4%_57%] from-emerald-300/10 to-slate-600/10 blur-2xl" />
    </div>
  );
}
