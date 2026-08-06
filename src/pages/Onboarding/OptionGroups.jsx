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
                    style={{ height: `${question.rowHeight ?? 68}px` }}
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

export function GridOptions({ question, selectedId, onSelect }) {
    return (
        <div className="absolute left-[16px] top-[264px] w-[358px] grid grid-cols-2 gap-x-[14px] gap-y-[19px]">
            {question.options.map((option) => (
                <button
                    key={option.id}
                    type="button"
                    onClick={() => onSelect(option.id)}
                    className={`relative w-[172px] h-[102px] rounded-[20px] border-2 bg-white cursor-pointer
                        ${selectedId === option.id
                            ? "border-[#65DBBE] shadow-[0px_1px_1px_0px_rgba(101,219,190,0.25)]"
                            : "border-[#F0F0F0] shadow-[0px_1px_1px_0px_rgba(148,148,148,0.25)]"}`}
                >
                    <img
                        src={option.icon}
                        alt=""
                        className="absolute left-1/2 -translate-x-1/2"
                        style={{ top: `${option.iconTop}px`, width: `${option.iconSize}px`, height: `${option.iconSize}px` }}
                    />
                    <span className="absolute left-0 top-[56px] w-[172px] text-center
                        text-[16px] font-medium text-[#0F0F0F] tracking-[-0.16px] leading-[28px]">
                        {option.label}
                    </span>
                </button>
            ))}
        </div>
    );
}
