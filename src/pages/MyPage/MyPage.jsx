import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import usePointStore from "../../store/usePointStore";
import useUserStore from "../../store/useUserStore";

import { toProfile } from "../../api/mypage";
import { getStampBooks } from "../../api/stamp";

import ProfileCard from "../../components/mypage/ProfileCard";
import PointCard from "../../components/mypage/PointCard";
import StampCard from "../../components/mypage/StampCard";

const formatDateLabel = (dateString) => {
  const [, month, day] = dateString.split("-");

  return `${Number(month)}/${Number(day)}`;
};

const normalizeStampBook = (stampBook, index) => ({
  id: index + 1,

  dateLabel: formatDateLabel(stampBook.startDate),

  courseLabel:
    stampBook.status === "COMPLETED"
      ? `${stampBook.periodDays}DAY`
      : stampBook.displayText,

  status:
    stampBook.status === "COMPLETED"
      ? "done"
      : "inProgress",

  startDate: stampBook.startDate,
  endDate: stampBook.endDate,
  periodDays: stampBook.periodDays,
  progressDays: stampBook.progressDays,
});

export default function MyPage() {
  const navigate = useNavigate();

  const user = useUserStore((state) => state.user);
  const fetchUser = useUserStore((state) => state.fetchUser);

  const point = usePointStore(
    (state) => state.point,
  );

  const fetchPoint = usePointStore(
    (state) => state.fetchPoint,
  );

  const [stampBooks, setStampBooks] = useState([]);

  const [
    completedStampBookCount,
    setCompletedStampBookCount,
  ] = useState(0);

  useEffect(() => {
    if (user) return;

    fetchUser().catch(() => {});
  }, [user, fetchUser]);

  useEffect(() => {
    fetchPoint();
  }, [fetchPoint]);

  useEffect(() => {
    const fetchStampBooks = async () => {
      try {
        const data = await getStampBooks();

        console.log(
          "스탬프북 카드 조회:",
          data,
        );

        setCompletedStampBookCount(
          data.completedStampBookCount ?? 0,
        );

        setStampBooks(
          (data.stampBooks ?? []).map(
            (stampBook, index) =>
              normalizeStampBook(
                stampBook,
                index,
              ),
          ),
        );
      } catch (error) {
        console.error(
          "스탬프북 카드 조회 실패:",
          error,
        );

        setCompletedStampBookCount(0);
        setStampBooks([]);
      }
    };

    fetchStampBooks();
  }, []);

  const profile = toProfile(user);

  return (
    <div className="flex min-h-full flex-col bg-[#eff7f7] pb-[24px]">
      <h1 className="pt-[9px] text-center text-[20px] font-medium text-black">
        마이페이지
      </h1>

      <div className="mt-[65px] px-[19px]">
        <ProfileCard
          profile={profile}
          onEditNickname={() =>
            navigate("/mypage/nickname")
          }
        />
      </div>

      <div className="mt-[14px] px-[19px]">
        <PointCard
          point={point}
          onGoToProduct={() =>
            navigate("/product")
          }
        />
      </div>

      <h2 className="mt-[29px] px-[19px] text-[16px] font-semibold text-black">
        스탬프 총 {completedStampBookCount}개 수집 완료
      </h2>

      <ul className="mt-[17px] flex gap-[22px] px-[19px]">
        {stampBooks.map((stamp) => (
          <li key={stamp.id}>
            <StampCard
              stamp={stamp}
              onClick={() =>
                navigate(
                  `/mypage/stamp/${stamp.id}`,
                )
              }
            />
          </li>
        ))}
      </ul>
    </div>
  );
}