import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import useOnboardingStore from "../../store/useOnboardingStore";
import useLayoutStore from "../../store/useLayoutStore";
import NicknameConfirm from "../../components/mypage/NicknameConfirm";

import arrowBack from "../../assets/icons/arrow_back.svg";

const MAX_LENGTH = 12;

export default function NicknameEdit() {
  const navigate = useNavigate();

  const setNickname = useOnboardingStore((state) => state.setNickname);
  const setHideFooter = useLayoutStore((state) => state.setHideFooter);

  const [value, setValue] = useState("");
  const [showEmptyError, setShowEmptyError] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

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
      setShowEmptyError(true);
      return;
    }

    setIsConfirming(true);
  };

  const handleConfirm = () => {
    setNickname(trimmed);
    navigate("/mypage");
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
            setShowEmptyError(false);
          }}
          placeholder="이름 입력하기"
          maxLength={MAX_LENGTH}
          autoFocus
          className="h-[52px] w-full rounded-[12px] border border-ink-300 bg-ink-50 px-[14px] text-[16px] leading-[1.6] text-ink-900 outline-none placeholder:text-ink-300"
        />

        {showEmptyError && (
          <p className="mt-[8px] text-[12px] font-medium text-sale">
            닉네임을 입력해주세요
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
          onCancel={() => setIsConfirming(false)}
        />
      )}
    </div>
  );
}
