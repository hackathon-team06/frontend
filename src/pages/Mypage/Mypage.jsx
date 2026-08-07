import checkIcon from "../../assets/icons/check_icon.svg";

import Stamp from "../../components/common/StampCard/StampCard";

import { useNavigate } from "react-router-dom";

const testUser = [
  {
    name: "수분남",
    age: "21~25세",
    skinType: "지성피부",
    purpose: "수분 챙기기",
  },
];

const week = [
  { day: "월", completed: true },
  { day: "화", completed: true },
  { day: "수", completed: true },
  { day: "목", completed: false },
  { day: "금", completed: false },
  { day: "토", completed: false },
  { day: "일", completed: false },
];

export default function MyPage() {
  const today = new Date();

  const dayList = ["일", "월", "화", "수", "목", "금", "토"];
  const day = dayList[today.getDay()];

  const navigate = useNavigate();

  return (
    <div>
      <p className="text-black text-xl font-medium ml-[149px] mt-[53px]">
        마이페이지
      </p>
      <div className="w-20 h-20 rounded-full bg-[#D9D9D9] mt-[39px] ml-[153px]" />
      {testUser.map((user) => (
        <div
          key={user.name}
          className="flex flex-col items-center gap-4 mt-[22px]"
        >
          <p className="text-stone-950 text-base font-medium">{user.name}</p>
          <div className="flex gap-[6px] items-center">
            <p className="text-stone-950 text-xs font-semibold">{user.age}</p>
            <div className="w-[1px] h-3 bg-[#BABABA]" />
            <p className="text-stone-950 text-xs font-semibold">
              {user.skinType}
            </p>
            <div className="w-[1px] h-3 bg-[#BABABA]" />
            <p className="text-stone-950 text-xs font-semibold">
              {user.purpose}
            </p>
          </div>
        </div>
      ))}
      <p className="mt-[43px] ml-[19px] text-black text-sm font-semibold">
        14일 유수분 밸런스 코스 (4일 차)
      </p>
      {week.map((item) => (
        <span
          key={item.day}
          className={`inline-block text-sm font-semibold ml-[37px] mt-[23px]
            ${item.day === day ? "bg-[#65DBBE] size-5 rounded-lg text-white inline-flex items-center justify-center leading-none" : "text-stone-950"}
          `}
        >
          {item.day}
        </span>
      ))}
      <div className="relative w-[340px] h-8 bg-[#C3C3C3] rounded-[20px] ml-[20px] mt-[14px]">
        {/* 초록 진행바 */}
        <div className="absolute left-0 top-0 w-[192px] h-full bg-[#65DBBE] rounded-[20px]">
          <img src={checkIcon} className="absolute left-[10px]" />
          <img src={checkIcon} className="absolute left-[57px]" />
          <img src={checkIcon} className="absolute left-[104px]" />
        </div>
      </div>
      <p className="text-black text-lg font-semibold mt-13 ml-[19px]">
        스탬프 총 4개 수집 완료
      </p>
      <div className="flex flex-wrap gap-[8px] ml-[19px] mt-[31px] mb-[10px]">
        <Stamp date="4/7" day="21DAY" />
        <Stamp
          date="5/1"
          day="28DAY"
          onClick={() => navigate("/mypage/stamp")}
        />
        <Stamp date="6/3" day="7DAY" />
        <Stamp date="6/12" day="28DAY" />
        <Stamp date="7/26" day="진행중.." />
      </div>
    </div>
  );
}
