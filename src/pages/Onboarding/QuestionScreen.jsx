import phone from "../../assets/images/phone.svg";
import mascot from "../../assets/images/onboarding_mascot.png";
import backArrow from "../../assets/icons/back_arrow.svg";

import { ListOptions, DetailOptions, GridOptions } from "./OptionGroups";

export default function QuestionScreen({ question, stepIndex, totalSteps, selectedId, onSelect, onBack, onNext }) {

    const height = question.height ?? 844;
    const buttonTop = question.buttonTop ?? 750;
    const mascotTop = question.mascotTop ?? 84;
    const arrowTop = question.arrowTop ?? 126;
    const titleTop = question.titleTop ?? 163;

    return (
        <div className="relative w-[390px]" style={{ height: `${height}px` }}>
            <img src={phone} alt="" className="mt-2" />
            {/* 뒤로가기 : 첫 문항에는 없다 */}
            {stepIndex > 0 && (
                <button
                    type="button"
                    aria-label="이전 문항"
                    onClick={onBack}
                    className="absolute left-[43px] w-[21px] h-[42px] cursor-pointer"
                    style={{ top: `${arrowTop}px` }}
                >
                    <img src={backArrow} alt="" className="w-[21px] h-[42px]" />
                </button>
            )}
            <img
                src={mascot}
                alt=""
                className="absolute left-[149px] w-[92px] h-[82px]"
                style={{ top: `${mascotTop}px` }}
            />
            {/* 문항 제목 */}
            <p
                className="absolute left-0 w-[390px] px-[30px] text-[24px] font-semibold text-[#0F0F0F] text-center leading-[32px] whitespace-pre-line"
                style={{ top: `${titleTop}px` }}
            >
                {question.title}
            </p>
            {/* 진행 바 : 칸 수를 문항 개수에서 계산한다 */}
            <div className="absolute left-[17px] top-[241px] w-[356px] flex gap-[4px]">
                {Array.from({ length: totalSteps }, (_, index) => (
                    <div
                        key={index}
                        className={`flex-1 h-[4px] rounded-[2px] ${index <= stepIndex ? "bg-[#78BAA9]" : "bg-[#BFBEBE]"}`}
                    />
                ))}
            </div>
            {question.type === "list" && (
                <ListOptions question={question} selectedId={selectedId} onSelect={onSelect} />
            )}
            {question.type === "detail" && (
                <DetailOptions question={question} selectedId={selectedId} onSelect={onSelect} />
            )}
            {question.type === "grid" && (
                <GridOptions question={question} selectedId={selectedId} onSelect={onSelect} />
            )}
            {/* 하단 버튼 : 답을 고르기 전에는 비활성 */}
            <button
                type="button"
                disabled={!selectedId}
                onClick={onNext}
                style={{ top: `${buttonTop}px` }}
                className="absolute left-[19px] w-[352px] h-[52px] bg-[#65DBBE] rounded-[14px]
                    text-[20px] font-semibold text-white
                    disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
                다음으로
            </button>
        </div>
    );
}
