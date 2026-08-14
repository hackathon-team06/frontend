import partnerGlow from "../../assets/images/partner_glow.svg";
import partnerCharacter from "../../assets/images/partner_character.png";

/**
 * 구매하기 클릭 시 제휴사로 이동하는 동안 보여주는 안내 화면.
 *
 * 화면을 스크롤한 상태에서도 항상 같은 위치에 보이도록 화면 기준(fixed)으로 띄우고,
 * 앱 폭(390px)만큼만 덮습니다.
 */
export default function PartnerLoading() {
  return (
    <div className="fixed inset-0 z-30 flex justify-center">
      <div className="relative flex h-full w-[390px] flex-col items-center overflow-hidden bg-ink-50">
        {/* 배경 민트 원 (블러 포함) */}
        <img
          src={partnerGlow}
          alt=""
          className="pointer-events-none absolute left-1/2 top-[163px] w-[572px] max-w-none -translate-x-1/2"
        />

        <img
          src={partnerCharacter}
          alt=""
          className="relative mt-[313px] size-[84px]"
        />

        <p className="relative mt-[30px] text-center text-[28px] font-semibold leading-[32px] text-ink-900">
          <span className="text-mint-600">제휴사</span>로 이동중이에요
          <br />
          조금만 기다려주세요
        </p>
      </div>
    </div>
  );
}
