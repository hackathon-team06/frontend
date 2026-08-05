import { useState } from "react";
import { useNavigate } from "react-router-dom";

import loginVisual from "../../assets/images/login_visual.png";
import { TEST_ACCOUNT } from "../../constants/auth";
import useAuthStore from "../../store/authStore";

function LoginInput({ type, placeholder, value, onChange }) {
    return (
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="w-[360px] h-[60px] bg-white border border-[#C3C3C3] rounded-[28px] px-[15px] outline-none
                text-[14px] font-medium text-stone-950 placeholder:text-[#A8A8A8]"
        />
    );
}

export default function Main() {

    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);

    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        // 빈 값으로 제출한 경우도 불일치와 같은 메시지로 처리한다
        if (id !== TEST_ACCOUNT.id || password !== TEST_ACCOUNT.password) {
            setError("아이디 또는 비밀번호가 일치하지 않습니다.");
            return;
        }

        setError("");
        login(id);
        navigate("/home");
    };

    return (
        <div>
            {/* 상단 장식 영역 : 프레임 전체 이미지를 550px 지점에서 잘라 노출 */}
            <div className="w-[390px] h-[550px] overflow-hidden">
                <img src={loginVisual} alt="" className="w-[390px]" />
            </div>
            {/* 로그인 폼 */}
            <form className="flex flex-col items-center gap-[11px] mt-[10px]" onSubmit={handleSubmit}>
                <LoginInput type="text" placeholder="아이디" value={id} onChange={(e) => setId(e.target.value)} />
                <LoginInput type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit" className="w-[360px] h-[60px] bg-[#63D7BB] rounded-[28px] cursor-pointer
                    text-white text-[20px] font-medium">
                    로그인하기
                </button>
                {error && <p className="text-[13px] font-normal text-red-500 mt-[4px]">{error}</p>}
            </form>
        </div>
    );
}
