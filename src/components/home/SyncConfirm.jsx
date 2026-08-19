import Blur from "../../assets/images/blur.svg";
import SyncImage from "../../assets/images/google_calendar_sync.svg";
import Twinkle from "../../assets/icons/twinkle_icon.svg";
import Rhombus from "../../assets/icons/rhombus_icon.svg";
import BigBtn from "./BigBtn";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getConnectUrl } from "../../api/googleCalendar";

export default function SyncConfirm() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleSyncBtn = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setHasError(false);

    try {
      const { authorizationUrl } = await getConnectUrl();

      window.location.href = authorizationUrl;
    } catch {
      setHasError(true);
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="pl-7.5 mt-11">
        <p className="text-cyan-900 text-4xl font-semibold">
          캘린더를
          <br />
          연동하시겠습니까?
        </p>
        <p className="text-neutral-400 text-sm font-medium leading-6">
          바쁜 일정 속에서도 루틴을 놓치지
          <br />
          않도록 도와드릴게요.
        </p>
        <div className="pl-6 relative">
          {/* 이미지로 하드 코딩 */}
          <img src={Blur} alt="블러" />
          <img
            src={SyncImage}
            alt="연동이미지"
            className="absolute top-[25%] left-[25%]"
          />
          <img
            src={Twinkle}
            alt="twinkle"
            className="absolute top-[27%] left-[75%]"
          />
          <img
            src={Twinkle}
            alt="twinkle"
            className="absolute top-[55%] left-[]"
          />
          <img
            src={Rhombus}
            alt="rhombus"
            className="absolute top-[36%] left-[83%]"
          />
          <img
            src={Rhombus}
            alt="rhombus"
            className="absolute top-[60%] left-[15%]"
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex gap-5.5 justify-center mt-9">
          <div className="size-2 rounded-xl bg-green-200" />
          <div className="size-2 rounded-xl bg-green-200" />
          <div className="size-2 rounded-xl bg-emerald-300" />
        </div>
        <div className="mt-3 flex justify-center">
          <button
            onClick={() => navigate("/home")}
            className="underline text-xs cursor-pointer font-medium text-neutral-400"
          >
            나중에 연동할게요
          </button>
        </div>

        {hasError && (
          <p className="text-center text-xs font-medium text-sale">
            연동을 시작하지 못했어요. 잠시 후 다시 시도해주세요.
          </p>
        )}
      </div>
      <BigBtn
        text={isLoading ? "연동 준비 중..." : "구글캘린더와 연동하기"}
        onClick={handleSyncBtn}
      />
    </div>
  );
}
