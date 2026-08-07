import { useNavigate } from "react-router-dom";

import loginVisual from "../../assets/images/login_visual.png";
import useAuthStore from "../../store/authStore";
import useOnboardingStore from "../../store/onboardingStore";

export default function Main() {

    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);
    const hasCompletedOnboarding = useOnboardingStore((state) => state.hasCompletedOnboarding);

    // 시연용 로그인. 백엔드 로그인 API가 붙으면 여기서 요청을 보내고
    // 응답으로 받은 사용자 정보를 login()에 넘기도록 바꾼다.
    const handleTestLogin = () => {
        login("test");
        navigate(hasCompletedOnboarding ? "/home" : "/onboarding");
    };

    return (
        <div className="min-h-full bg-[#F3F9F7]">
            {/* 상단 장식 영역 : 프레임 전체 이미지를 550px 지점에서 잘라 노출 */}
            <div className="w-[390px] h-[550px] overflow-hidden">
                <img src={loginVisual} alt="" className="w-[390px]" />
            </div>
            {/* 입력 없이 버튼 하나로 테스트 계정에 진입한다 */}
            <div className="flex justify-center mt-[190px]">
                <button
                    type="button"
                    onClick={handleTestLogin}
                    className="w-[352px] h-[56px] bg-white border-2 border-[#65DBBE] rounded-[28px] cursor-pointer
                        shadow-[0px_3px_1px_0px_rgba(88,206,174,0.25)]
                        text-[18px] font-semibold text-[#65DBBE]"
                >
                    테스트 계정으로 로그인
                </button>
            </div>
        </div>
    );
}
