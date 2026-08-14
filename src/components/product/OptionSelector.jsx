import { useState } from "react";

import PointBadge from "./PointBadge";
import { getPointPrice } from "../../constants/product";
import checkWhite from "../../assets/icons/check_white.svg";

/**
 * 용량·수량 옵션 선택.
 *
 * 수량 옵션은 기본 3개만 보여주고 "옵션 한번에 보기"로 전부 펼칩니다.
 * "최저가" 배지는 같은 용량 안에서 단위당 가격(100mL당·1매당·1정당)이
 * 가장 낮은 옵션에 붙습니다.
 */
export default function OptionSelector({ detail, selectedOption, onSelect }) {
  const [expanded, setExpanded] = useState(false);

  const rows = detail.options.filter(
    (option) => option.amountLabel === selectedOption.amountLabel,
  );

  const lowestId = rows.reduce(
    (lowest, option) => (option.unitPrice < lowest.unitPrice ? option : lowest),
    rows[0],
  ).id;

  const visibleRows = expanded ? rows : rows.slice(0, 3);

  // 용량을 바꿔도 고르던 수량은 그대로 이어갑니다.
  const handleAmountChange = (amountLabel) => {
    const next = detail.options.find(
      (option) =>
        option.amountLabel === amountLabel &&
        option.quantity === selectedOption.quantity,
    );

    if (next) onSelect(next);
  };

  return (
    <section>
      <div className="h-px w-full bg-ink-300" />

      <div className="flex items-center gap-[6px] px-[19px] pt-[16px] text-[16px] font-medium text-ink-900">
        <span>용량,수량</span>
        <span className="h-[12px] w-px bg-ink-300" />
        <span>
          {selectedOption.amountLabel}, {selectedOption.quantity}개
        </span>
      </div>

      <div className="mt-[15px] flex gap-[10px] px-[21px]">
        {detail.amountLabels.map((amountLabel) => {
          const selected = amountLabel === selectedOption.amountLabel;

          return (
            <button
              key={amountLabel}
              type="button"
              onClick={() => handleAmountChange(amountLabel)}
              aria-pressed={selected}
              className={`h-[36px] w-[72px] cursor-pointer rounded-[8px] border text-[16px] font-medium ${
                selected
                  ? "border-[#95dcda] bg-mint-50 text-mint-600"
                  : "border-ink-300 text-ink-400"
              }`}
            >
              {amountLabel}
            </button>
          );
        })}
      </div>

      <ul className="mt-[18px]">
        {visibleRows.map((option) => (
          <OptionRow
            key={option.id}
            option={option}
            selected={option.id === selectedOption.id}
            lowest={option.id === lowestId}
            onSelect={() => onSelect(option)}
          />
        ))}
      </ul>

      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="mt-[12px] w-full cursor-pointer text-center text-[15px] font-medium tracking-[-0.15px] text-ink-900"
      >
        {expanded ? "옵션 닫기" : "옵션 한번에 보기"}
      </button>
    </section>
  );
}

function OptionRow({ option, selected, lowest, onSelect }) {
  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        className={`relative flex h-[80px] w-full cursor-pointer items-center px-[26px] text-left ${
          selected ? "bg-mint-50" : ""
        }`}
      >
        <span
          className={`flex size-[24px] shrink-0 items-center justify-center rounded-[15px] ${
            selected ? "bg-mint-600" : "border-2 border-ink-300"
          }`}
        >
          {selected && <img src={checkWhite} alt="" className="size-[16px]" />}
        </span>

        <span
          className={`ml-[25px] shrink-0 text-[16px] font-medium ${
            selected ? "text-mint-600" : "text-ink-400"
          }`}
        >
          {option.quantity}개
        </span>

        <span className="ml-[18px] flex flex-col gap-[2px]">
          <span className="text-[18px] font-medium leading-[20px] text-ink-900">
            {option.price.toLocaleString()}원
          </span>
          <span
            className={`text-[13px] font-medium leading-[20px] ${
              selected ? "text-ink-900" : "text-ink-400"
            }`}
          >
            {option.unitPriceLabel}
          </span>
        </span>

        {lowest && (
          <span className="absolute right-[24px] top-[30px] rounded-full bg-mint-50 px-[9px] py-[3px] text-[12px] font-semibold leading-[1.6] text-mint-600">
            최저가
          </span>
        )}

        {selected && (
          <span className="absolute right-[17px] top-[6px] flex items-center gap-[4px]">
            <span className="text-[12px] font-medium leading-[20px] text-black">
              포인트 사용시
            </span>
            <span className="text-[14px] font-medium leading-[20px] text-mint-500">
              {getPointPrice(option.price).toLocaleString()}
            </span>
            <PointBadge />
          </span>
        )}
      </button>
    </li>
  );
}
