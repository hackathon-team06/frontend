import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import completeCharacter from "../../assets/images/complete_character.svg";

export default function Complete() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/home");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="relative flex min-h-screen flex-col items-center overflow-hidden bg-white">
      <header className="mt-[200px] flex flex-col items-center text-center">
        <p className="text-3xl font-bold leading-[51.20px] tracking-wide text-cyan-900">
          좋아요,{" "}
          <span className="text-3xl font-bold leading-[51.20px] tracking-wide text-emerald-300">
            준비됐어요!
          </span>
        </p>
        <p className="text-2xl font-bold leading-10 tracking-wide text-cyan-900">
          오늘부터 하나씩 시작해봐요
        </p>
        <p className="mt-[4px] text-xs font-medium leading-5 tracking-tight text-neutral-400">
          무리하지 않아도 괜찮아요. 작은 루틴부터 함께 만들어가요.
        </p>
      </header>
      <img src={completeCharacter} className="absolute bottom-0" />
    </div>
  );
}