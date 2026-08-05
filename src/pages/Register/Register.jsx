import backButton from "../../assets/images/back_button.svg";
import phone from "../../assets/images/phone.svg";

import { useNavigate } from "react-router-dom";

function OptionButton({title}) {
    return (
        <button className="min-w-[60px] h-9 rounded-lg outline-1 outline-offset-[-1px] outline-stone-300
            pt-[7px] pb-[8px] pl-[14px] pr-[14px] cursor-pointer hover:bg-[#65DBBE] hover:text-white">{title}</button>
    );
}

function RegisterButton({onClick}) {
    return (
        <div className="fixed bottom-[29px] left-[565px]" onClick={onClick}>
            <button className="cursor-pointer hover:bg-[#4FCFAF] w-[332px] h-[52px] bg-emerald-300 rounded-[20px] text-black text-lg font-semibold">일정 등록하기</button>
        </div>     
    );
}

export default function Register() {

    const navigate = useNavigate();

    const today = new Date();

    const month = today.getMonth() + 1;
    const date = today.getDate();

    const dayList = ["일", "월", "화", "수", "목", "금", "토"];
    const day = dayList[today.getDay()];

    return (
        <div>
            <img src={phone} className="mt-2" />
            <img src={backButton} className="ml-[14px] mt-[5px] cursor-pointer" onClick={() => navigate("/home")}/>
            <header className="flex flex-col mt-9 ml-4 gap-[13px]">
                <p className="text-black text-xl font-semibold">{month}월&nbsp;{date}일&nbsp;{day}요일</p>
                <p className="text-stone-950 text-sm font-normal">목표까지 <span className="text-emerald-300 text-sm font-normal">여섯</span>걸음</p>
            </header>
            <main className="flex flex-col mt-[46px] ml-4 gap-[22px]">
                <p className="text-black text-lg font-bold">누구랑 약속이 있으신가요?</p>
                <section className="flex flex-col gap-[10px]">
                    <div className="flex gap-[10px]">
                        <OptionButton title="연인" />
                        <OptionButton title="직장동료" />
                        <OptionButton title="친구" />
                    </div>
                    <div className="flex gap-[10px]">
                        <OptionButton title="가족/친척" />
                        <OptionButton title="지인/모임" />
                    </div> 
                </section>
            </main>
            <main className="flex flex-col mt-[46px] ml-4 gap-[22px]">
                <p className="text-black text-lg font-bold">어떤 일정이 있으신가요?</p>
                <section className="flex flex-col gap-[10px]">
                    <div className="flex gap-[10px]">
                        <OptionButton title="데이트" />
                        <OptionButton title="미팅/면접" />
                        <OptionButton title="자기관리" />
                    </div>
                    <div className="flex gap-[10px]">
                        <OptionButton title="술자리모임" />
                        <OptionButton title="여행" />
                        <OptionButton title="결혼식" />
                    </div> 
                    <div className="flex gap-[10px]">
                        <OptionButton title="이벤트" />
                        <OptionButton title="친목/수다" />
                        <OptionButton title="행사" />
                    </div> 
                </section>
            </main>
            <RegisterButton onClick={() => navigate("/home")} />
        </div>

    );
}