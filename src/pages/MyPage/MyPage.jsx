import { useNavigate } from "react-router-dom";

import useOnboardingStore from "../../store/useOnboardingStore";
import { getMyProfile, getStamps } from "../../api/mypage";
import { MY_POINT } from "../../constants/product";

import ProfileCard from "../../components/mypage/ProfileCard";
import PointCard from "../../components/mypage/PointCard";
import StampCard from "../../components/mypage/StampCard";

export default function MyPage() {
  const navigate = useNavigate();

  // 닉네임·나이·피부타입·목표는 온보딩 스토어 값을 그대로 씁니다.
  const nickname = useOnboardingStore((state) => state.nickname);
  const age = useOnboardingStore((state) => state.age);
  const skinType = useOnboardingStore((state) => state.skinType);
  const purpose = useOnboardingStore((state) => state.purpose);

  const profile = getMyProfile({ nickname, age, skinType, purpose });
  const stamps = getStamps();

  return (
    <div className="flex min-h-full flex-col bg-[#eff7f7] pb-[24px]">
      <h1 className="pt-[9px] text-center text-[20px] font-medium text-black">
        마이페이지
      </h1>

      <div className="mt-[65px] px-[19px]">
        <ProfileCard
          profile={profile}
          onEditNickname={() => navigate("/mypage/nickname")}
        />
      </div>

      <div className="mt-[14px] px-[19px]">
        <PointCard point={MY_POINT} onGoToProduct={() => navigate("/product")} />
      </div>

      <h2 className="mt-[29px] px-[19px] text-[16px] font-semibold text-black">
        스탬프 총 {stamps.length}개 수집 완료
      </h2>

      <ul className="mt-[17px] flex gap-[22px] px-[19px]">
        {stamps.map((stamp) => (
          <li key={stamp.id}>
            <StampCard
              stamp={stamp}
              onClick={() => navigate(`/mypage/stamp/${stamp.id}`)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
