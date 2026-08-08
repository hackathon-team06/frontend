import profile from "../../assets/images/profile.svg";

import StampCard from "../../components/common/StampCard/StampCard";

import { useNavigate } from "react-router-dom";

const testUser = [
  {
    name: "수분남",
    age: "21~25세",
    skinType: "지성피부",
    purpose: "촉촉한 피부",
  },
];

export default function Mypage() {

  const navigate = useNavigate();

  return (
    <main className="bg-[#EFF7F7] h-[100vh]">
      <div className="flex flex-col items-center">
        <p className="text-black text-xl font-medium pt-[62px]">마이페이지</p>
        {/* 사용자 정보 */}
        <section className="mt-[65px] w-[352px] h-[134px] bg-white rounded-2xl shadow-[0px_-1px_3px_0px_rgba(0,0,0,0.05)]">
          {testUser.map((user) => (
            <div className="flex flex-col items-start">
              {/* 프로필 + 이름 */}
              <div className="flex gap-[15px] mt-[24px] ml-[19px]">
                <img src={profile} />
                <p className="text-stone-950 text-lg font-semibold mt-[3px]">
                  {user.name}
                </p>
              </div>
              <div className="w-80 h-[1px] bg-[#C3C3C3] ml-[16px] mt-[22px]" />
              {/* 나이 + 피부 타입 + 목적 */}
              <div className="flex ml-[19px] mt-[10px] items-center">
                <p className="text-stone-950 text-xs font-semibold">
                  {user.age}
                </p>
                <div className="w-[1px] h-3 bg-[#C3C3C3] ml-[57px]" />
                <p className="text-stone-950 text-xs font-semibold ml-[12px]">
                  {user.skinType}
                </p>
                <div className="w-[1px] h-3 bg-[#C3C3C3] ml-[61px]" />
                <p className="text-stone-950 text-xs font-semibold ml-[12px]">
                  {user.purpose}
                </p>
              </div>
            </div>
          ))}
        </section>
        {/* 포인트 */}
        <section className="relative mt-[14px] w-[352px] h-[106px] bg-white rounded-2xl shadow-[0px_-1px_3px_0px_rgba(0,0,0,0.05)]">
          <div className="flex flex-col gap-[15px]">
            <p className="text-black text-base font-medium mt-4 ml-3">현재 포인트</p>
            <p className="ml-3 text-[#65DBBE] text-xl font-medium">1163<span className="text-black text-xl font-medium">P</span></p>
            <p className="absolute bottom-[7px] right-4 text-black text-xs font-normal">제품 보러가기</p>
          </div>
        </section>
        <p className="text-black text-base font-semibold self-start mt-[22px] ml-[19px]">스탬프 총 4개 수집 완료</p>
        <div className="flex flex-wrap gap-2 ml-[19px] mt-4">
          <StampCard date="4/7" day="21DAY" />
          <StampCard date="5/1" day="28DAY" onClick={() => navigate("/mypage/stamp")}/>
          <StampCard date="6/3" day="7DAY" />
          <StampCard date="6/12" day="28DAY" />
          <StampCard date="7/26" day="진행중.." />
        </div>
      </div>
    </main>
  );
}
