import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import useOnboardingStore from "../../store/useOnboardingStore";
import useLayoutStore from "../../store/useLayoutStore";
import useUserStore from "../../store/useUserStore";
import { updateNickname } from "../../api/user";
import NicknameConfirm from "../../components/mypage/NicknameConfirm";

import arrowBack from "../../assets/icons/arrow_back.svg";

const MAX_LENGTH = 12;

/** 서버가 요구하는 최소 글자 수. 1글자로 보내면 400 이 납니다. */
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

  // 디자인에 하단 탭바가 없는 화면입니다.
  useEffect(() => {
    setHideFooter(true);
    return () => setHideFooter(false);
  }, [setHideFooter]);

  const trimmed = value.trim();

  // 키보드의 완료(Enter)를 누르면 바로 저장하지 않고 확인 화면을 띄웁니다.
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!trimmed) {
      setInputError("닉네임을 입력해주세요");
      return;
    }

    // 서버가 2자 미만을 거절합니다. 요청을 보내기 전에 걸러냅니다.
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

      // 서버가 갱신된 내 정보를 통째로 돌려주므로 그대로 담습니다.
      setUser(user);

      // 마이페이지는 온보딩 스토어 값을 먼저 보므로 여기도 맞춰둡니다.
      setNickname(trimmed);

      navigate("/mypage");
    } catch {
      setSaveError("저장에 실패했어요. 잠시 후 다시 시도해주세요.");
      setIsSaving(false);
    }
  };

  return (
    <div className="relative min-h-full bg-white">
      {/* 디자인에는 없지만 이 화면을 빠져나갈 방법이 필요해 추가했습니다. */}
      <button
        type="button"
        onClick={() => navigate("/mypage")}
        aria-label="뒤로 가기"
        className="absolute left-[23px] top-[25px] flex h-[36px] w-[18px] cursor-pointer items-center justify-center"
      >
        <img src={arrowBack} alt="" style={{ width: 10.7, height: 19.46 }} />
      </button>

      {/* 디자인의 63px 은 상태바 아래 기준이라, 뒤로가기 버튼과 겹치지 않게 내렸습니다.
          여기를 바꾸면 NicknameConfirm 의 확인 박스 위치도 함께 맞춰야 합니다. */}
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

        {/* 화면에 보이지 않지만, 키보드의 완료 버튼이 제출로 동작하게 합니다. */}
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
