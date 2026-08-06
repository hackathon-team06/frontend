import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import phone from "../../assets/images/phone.svg";
import loadingMascot from "../../assets/images/onboarding_loading/mascot.png";
import icon1 from "../../assets/images/onboarding_loading/icon_1.png";
import icon2 from "../../assets/images/onboarding_loading/icon_2.png";
import icon3 from "../../assets/images/onboarding_loading/icon_3.png";
import icon4 from "../../assets/images/onboarding_loading/icon_4.png";
import icon5 from "../../assets/images/onboarding_loading/icon_5.png";
import icon6 from "../../assets/images/onboarding_loading/icon_6.png";

// 시안의 좌표를 그대로 옮긴다
const FLOATING_ICONS = [
    { src: icon1, className: "left-[146px] top-[204px] w-[36px] h-[36px]" },
    { src: icon2, className: "left-[214px] top-[204px] w-[33px] h-[33px]" },
    { src: icon3, className: "left-[97px] top-[234px] w-[32px] h-[32px]" },
    { src: icon4, className: "left-[262px] top-[234px] w-[38px] h-[38px]" },
    { src: icon5, className: "left-[68px] top-[286px] w-[32px] h-[32px]" },
    { src: icon6, className: "left-[289px] top-[286px] w-[34px] h-[34px]" },
];

export default function OnboardingLoading() {

    const navigate = useNavigate();

    // 2초 뒤 홈으로 보낸다. 히스토리를 교체해 뒤로가기로 되돌아오지 않게 한다.
    useEffect(() => {
        const timer = setTimeout(() => navigate("/home", { replace: true }), 2000);
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="relative w-[390px] h-[844px]">
            <img src={phone} className="mt-2" />
            {FLOATING_ICONS.map((icon) => (
                <img key={icon.className} src={icon.src} className={`absolute ${icon.className}`} />
            ))}
            <img src={loadingMascot} className="absolute left-[144px] top-[288px] w-[96px] h-[124px]" />
            <p className="absolute left-0 top-[500px] w-[390px] text-center text-[24px] font-semibold text-black">
                오늘의 미션을 준비하고 있어요!
            </p>
            <p className="absolute left-0 top-[544px] w-[390px] text-center text-[18px] font-medium text-black leading-normal">
                고객님의 정보를 확인하고 있습니다.
                <br />
                잠시만 기다려 주세요..
            </p>
        </div>
    );
}
