import profileDefault from "../../assets/images/profile_default.png";
import pencil from "../../assets/icons/pencil.svg";

/** 마이페이지 프로필 카드. */
export default function ProfileCard({ profile, onEditNickname }) {
  const { nickname, age, skinTypeLabel, goal, progressDay, profileImageUrl } =
    profile;

  return (
    <section className="relative h-[134px] w-[352px] rounded-[15px] border border-[#dbe7e8] bg-white shadow-[0px_-1px_5px_0px_rgba(101,219,190,0.3)]">
      <img
        src={profileImageUrl || profileDefault}
        alt=""
        className="absolute left-[18px] top-[23px] size-[45px] rounded-full object-cover"
      />

      <div className="absolute left-[78px] top-[29px] flex items-center gap-[10px]">
        <span className="text-[18px] font-semibold text-[#0f0f0f]">
          {nickname}
        </span>

        <button
          type="button"
          onClick={onEditNickname}
          aria-label="닉네임 수정"
          className="cursor-pointer"
        >
          <img src={pencil} alt="" className="size-[12px]" />
        </button>
      </div>

      <p className="absolute left-[78px] top-[49px] w-[96px] text-center text-[14px] font-semibold leading-[32px] text-mint-500">
        ({progressDay}일째 진행중)
      </p>

      <div className="absolute left-[15px] top-[89px] h-px w-[320px] bg-[#c3c3c3]" />

      <div className="absolute left-[18px] top-[101px] flex items-center text-[12px] font-semibold text-[#0f0f0f]">
        <span className="w-[111px]">{age}세</span>
        <span className="h-[12px] w-px bg-[#c3c3c3]" />
        <span className="w-[103px] pl-[13px]">{skinTypeLabel}</span>
        <span className="h-[12px] w-px bg-[#c3c3c3]" />
        <span className="pl-[13px]">{goal}</span>
      </div>
    </section>
  );
}
