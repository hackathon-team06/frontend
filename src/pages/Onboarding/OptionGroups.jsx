// 라디오 버튼 : 시안의 SVG 대신 CSS로 그린다
function Radio({ selected }) {
    return (
        <div className={`w-[18px] h-[18px] rounded-full border-2 bg-white flex items-center justify-center shrink-0
            ${selected ? "border-[#65DBBE]" : "border-[#EBEBEB]"}`}>
            {selected && <div className="w-[10px] h-[10px] rounded-full bg-[#65DBBE]" />}
        </div>
    );
}

export function ListOptions({ question, selectedId, onSelect }) {
    return (
        <div className="absolute left-[19px] top-[283px] w-[352px] flex flex-col gap-[11px]">
            {question.options.map((option) => (
                <button
                    key={option.id}
                    type="button"
                    onClick={() => onSelect(option.id)}
                    style={{ height: `${question.rowHeight}px` }}
                    className={`w-[352px] rounded-[12px] bg-white border-2 cursor-pointer
                        flex items-center justify-between pl-[15px] pr-[19px]
                        ${selectedId === option.id ? "border-[#65DBBE]" : "border-[#F0F0F0]"}`}
                >
                    <span className="text-[18px] font-medium text-[#0F0F0F]">{option.label}</span>
                    <Radio selected={selectedId === option.id} />
                </button>
            ))}
        </div>
    );
}

export function DetailOptions({ question, selectedId, onSelect }) {
    return (
        <div className="absolute left-[17px] top-[283px] w-[352px] flex flex-col gap-[11px]">
            {question.options.map((option) => (
                <button
                    key={option.id}
                    type="button"
                    onClick={() => onSelect(option.id)}
                    className={`relative w-[352px] h-[168px] rounded-[12px] bg-white border-2 cursor-pointer text-left
                        ${selectedId === option.id ? "border-[#65DBBE]" : "border-[#F0F0F0]"}`}
                >
                    <span className="absolute left-[15px] top-[18px] h-[20px] px-[4px] bg-[#65DBBE] rounded-[4px]
                        flex items-center text-[12px] font-medium text-white">
                        {option.tag}
                    </span>
                    <span className="absolute left-[15px] top-[46px] text-[20px] font-medium text-[#0F0F0F]">
                        {option.label}
                    </span>
                    <span className="absolute left-[16px] top-[72px] text-[14px] font-medium text-[#0F0F0F]">
                        {option.summary}
                    </span>
                    <ul className="absolute left-[7px] top-[102px] text-[14px] font-medium text-black">
                        {option.details.map((detail) => (
                            <li key={detail} className="list-disc ms-[21px] h-[23px]">{detail}</li>
                        ))}
                    </ul>
                    <div className="absolute left-[315px] top-[72px]">
                        <Radio selected={selectedId === option.id} />
                    </div>
                </button>
            ))}
        </div>
    );
}
