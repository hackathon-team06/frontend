import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import useOnboardingStore from "../../store/useOnboardingStore";
import usePointStore from "../../store/usePointStore";
import useUserStore from "../../store/useUserStore";
import { toProfile, getStamps } from "../../api/mypage";
import { getMyPoint } from "../../api/point";

import ProfileCard from "../../components/mypage/ProfileCard";
import PointCard from "../../components/mypage/PointCard";
import StampCard from "../../components/mypage/StampCard";

export default function MyPage() {
  const navigate = useNavigate();

  const user = useUserStore((state) => state.user);
  const fetchUser = useUserStore((state) => state.fetchUser);

  // 서버 조회가 실패했을 때 대신 쓸 값입니다.
  const nickname = useOnboardingStore((state) => state.nickname);
  const age = useOnboardingStore((state) => state.age);
  const skinType = useOnboardingStore((state) => state.skinType);
  const purpose = useOnboardingStore((state) => state.purpose);

  const point = usePointStore((state) => state.point);
  const setPoint = usePointStore((state) => state.setPoint);

  // 온보딩을 거치지 않고 바로 들어온 경우에도 사용자 정보를 조회합니다.
  useEffect(() => {
    if (user) return;

    fetchUser().catch(() => {});
  }, [user, fetchUser]);

  // 현재 로그인한 사용자의 보유 포인트 조회
  useEffect(() => {
    const fetchPoint = async () => {
      try {
        const data = await getMyPoint();
        setPoint(data.point);
      } catch (error) {
        console.error("포인트 조회 실패:", error);
      }
    };

    fetchPoint();
  }, [setPoint]);

  const profile = toProfile(user, {
    nickname,
    age,
    skinType,
    purpose,
  });

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
        <PointCard point={point} onGoToProduct={() => navigate("/product")} />
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
