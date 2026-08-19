import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import useOnboardingStore from "../../store/useOnboardingStore";
import useLayoutStore from "../../store/useLayoutStore";
import useUserStore from "../../store/useUserStore";
import { updateNickname } from "../../api/user";
import NicknameConfirm from "../../components/mypage/NicknameConfirm";

import arrowBack from "../../assets/icons/arrow_back.svg";

const MAX_LENGTH = 12;

const MIN_LENGTH = 2;

export default function NicknameEdit() {
  const navigate = useNavigate();

  const setNickname = useOnboardingStore((state) => state.setNickname);
  const setHideFooter = useLayoutStore((state) => state.setHideFooter);

  const setUser = useUserStore((state) => state.setUser);

  const [value, setValue] = useState("");
  const [inputError, setInputError] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    setHideFooter(true);
    return () => setHideFooter(false);
  }, [setHideFooter]);

  const trimmed = value.trim();

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!trimmed) {
      setInputError("닉네임을 입력해주세요");
      return;
    }

    if (trimmed.length < MIN_LENGTH) {
      setInputError(`닉네임은 ${MIN_LENGTH}글자 이상이어야 해요`);
      return;
    }

    setIsConfirming(true);
  };

  const handleConfirm = async () => {
    if (isSaving) return;

    setIsSaving(true);
    setSaveError("");

    try {
      const user = await updateNickname(trimmed);

      setUser(user);

      setNickname(trimmed);

      navigate("/mypage");
    } catch {
      setSaveError("저장에 실패했어요. 잠시 후 다시 시도해주세요.");
      setIsSaving(false);
    }
  };

  return (
    <div className="relative min-h-full bg-white">
      <button
        type="button"
        onClick={() => navigate("/mypage")}
        aria-label="뒤로 가기"
        className="absolute left-[23px] top-[25px] flex h-[36px] w-[18px] cursor-pointer items-center justify-center"
      >
        <img src={arrowBack} alt="" style={{ width: 10.7, height: 19.46 }} />
      </button>

      <div className="px-[40px] pt-[100px] text-[#2e4972]">
        <h1 className="text-[32px] font-bold leading-[1.6] tracking-[0.8px]">
          닉네임 입력하기
        </h1>
        <p className="text-[16px] font-semibold leading-[1.6] tracking-[0.4px]">
          직접 만들어보세요!
        </p>
      </div>

      <form className="mt-[38px] px-[20px]" onSubmit={handleSubmit}>
        <input
          type="text"
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            setInputError("");
          }}
          placeholder="이름 입력하기"
          maxLength={MAX_LENGTH}
          autoFocus
          className="h-[52px] w-full rounded-[12px] border border-ink-300 bg-ink-50 px-[14px] text-[16px] leading-[1.6] text-ink-900 outline-none placeholder:text-ink-300"
        />

        {inputError && (
          <p className="mt-[8px] text-[12px] font-medium text-sale">
            {inputError}
          </p>
        )}

        <button type="submit" className="sr-only">
          저장
        </button>
      </form>

      {isConfirming && (
        <NicknameConfirm
          nickname={trimmed}
          onConfirm={handleConfirm}
          onCancel={() => {
            setIsConfirming(false);
            setSaveError("");
          }}
          isSaving={isSaving}
          errorMessage={saveError}
        />
      )}
    </div>
  );
}
