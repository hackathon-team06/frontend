import loginVisual from "../../assets/images/login_visual.png";

function LoginInput({ type, placeholder }) {
    return (
        <input
            type={type}
            placeholder={placeholder}
            className="w-[360px] h-[60px] bg-white border border-[#C3C3C3] rounded-[28px] px-[15px] outline-none
                text-[14px] font-medium text-stone-950 placeholder:text-[#A8A8A8]"
        />
    );
}

export default function Main() {
    return (
        <div>
            {/* 상단 장식 영역 : 프레임 전체 이미지를 550px 지점에서 잘라 노출 */}
            <div className="w-[390px] h-[550px] overflow-hidden">
                <img src={loginVisual} alt="" className="w-[390px]" />
            </div>
            {/* 로그인 폼 */}
            <form className="flex flex-col items-center gap-[11px] mt-[10px]">
                <LoginInput type="text" placeholder="아이디" />
                <LoginInput type="password" placeholder="비밀번호" />
                <button type="submit" className="w-[360px] h-[60px] bg-[#63D7BB] rounded-[28px] cursor-pointer
                    text-white text-[20px] font-medium">
                    로그인하기
                </button>
            </form>
        </div>
    );
}
