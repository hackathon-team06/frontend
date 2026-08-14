import { useMemo, useState } from "react";

import useOnboardingStore from "../../store/useOnboardingStore";
import { PRODUCTS, SKIN_TYPES, CATEGORIES } from "../../mocks/products";

import heartFilled from "../../assets/icons/heart_filled.png";
import heartOutline from "../../assets/icons/heart_outline.svg";
import pointBadge from "../../assets/icons/point_badge.svg";

// 보유 포인트. 백엔드 연동 시 API 값으로 교체합니다.
const MY_POINT = 2179;

export default function Product() {
  // 온보딩에서 고른 피부 타입을 초기값으로 사용합니다.
  // 온보딩을 건너뛰고 바로 들어온 경우를 위해 "지성"을 폴백으로 둡니다.
  const mySkinType = useOnboardingStore((state) => state.skinType);

  const [skinType, setSkinType] = useState(mySkinType || "지성");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [likedIds, setLikedIds] = useState([]);

  const products = useMemo(
    () =>
      PRODUCTS.filter(
        (product) =>
          product.category === category &&
          product.skinTypes.includes(skinType),
      ),
    [category, skinType],
  );

  const toggleLike = (id) => {
    setLikedIds((prev) =>
      prev.includes(id) ? prev.filter((likedId) => likedId !== id) : [...prev, id],
    );
  };

  return (
    <div className="flex min-h-full flex-col bg-ink-50">
      {/* 헤더 */}
      <header className="flex items-end justify-between px-[19px] pt-[39px]">
        <h1 className="logo-font text-[22px] text-mint-600">stay care</h1>

        {/* TODO: 찜한 상품 목록 페이지 연결 */}
        <button
          type="button"
          className="flex h-[32px] w-[100px] items-center justify-between rounded-[26px] border border-ink-100 pl-[9px] pr-[11px]"
        >
          <span className="text-[16px] font-medium text-ink-900">찜한 상품</span>
          <img src={heartFilled} alt="" className="size-[17px]" />
        </button>
      </header>

      <p className="mt-[17px] px-[19px] text-right text-[20px] font-semibold text-ink-900">
        <span className="text-mint-600">{MY_POINT.toLocaleString()}</span>P
      </p>

      {/* 피부 타입 필터 */}
      <section className="px-4">
        <h2 className="text-[18px] font-semibold text-ink-900">피부 타입</h2>
        <div className="mt-[13px] flex gap-[10px]">
          {SKIN_TYPES.map((type) => {
            const selected = type === skinType;

            return (
              <button
                key={type}
                type="button"
                onClick={() => setSkinType(type)}
                aria-pressed={selected}
                className={`h-[28px] rounded-[5px] px-[8px] text-[16px] font-medium ${
                  selected
                    ? "bg-mint-600 text-ink-100"
                    : "border border-ink-400 text-ink-900"
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>
      </section>

      {/* 카테고리 탭 */}
      <nav className="mt-[31px] border-b-2 border-ink-300">
        <div className="-mb-[2px] flex justify-between px-[23px]">
          {CATEGORIES.map((name) => {
            const selected = name === category;

            return (
              <button
                key={name}
                type="button"
                onClick={() => setCategory(name)}
                aria-pressed={selected}
                className={`border-b-2 pb-[4px] text-[16px] font-medium ${
                  selected
                    ? "border-ink-900 text-ink-900"
                    : "border-transparent text-ink-500"
                }`}
              >
                {name}
              </button>
            );
          })}
        </div>
      </nav>

      {/* 추천 상품 */}
      <section className="px-4">
        <h2 className="mt-[19px] text-[18px] font-medium text-ink-900">추천 상품</h2>

        {products.length === 0 ? (
          <p className="py-[60px] text-center text-[14px] text-ink-500">
            해당 조건의 추천 상품을 준비 중이에요
          </p>
        ) : (
          <ul className="mt-[20px] grid grid-cols-2 gap-x-[10px] gap-y-[17px] pb-[24px]">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                liked={likedIds.includes(product.id)}
                onToggleLike={() => toggleLike(product.id)}
              />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function ProductCard({ product, liked, onToggleLike }) {
  const { name, isBest, price, discountRate, hasOptions, imageUrl } = product;

  // 포인트 사용시 가격 = 판매가 - 보유 포인트
  const pointPrice = Math.max(0, price - MY_POINT);

  return (
    // TODO: 카드 클릭 시 상품 상세 화면으로 이동 (다음 작업)
    <li className="flex flex-col gap-[9px]">
      <div className="h-[176px] w-full overflow-hidden rounded-[5px] bg-mint-50">
        {imageUrl && (
          <img src={imageUrl} alt="" className="size-full object-cover" />
        )}
      </div>

      <div className="flex flex-col gap-[6px]">
        <div className="flex flex-col gap-[4px]">
          <p className="text-[12px] font-medium leading-[1.3] tracking-[0.6px] text-ink-900">
            {isBest && (
              <>
                <span className="font-bold">BEST</span>
                <span className="text-ink-500"> ㅣ </span>
              </>
            )}
            {name}
          </p>

          <div>
            <div className="flex items-center gap-[2px] leading-[1.3]">
              {discountRate > 0 && (
                <span className="text-[14px] font-semibold tracking-[-0.28px] text-sale">
                  {discountRate}%
                </span>
              )}
              <span className="flex items-center text-ink-900">
                <span className="text-[14px] font-semibold">
                  {price.toLocaleString()}
                </span>
                <span className="text-[12px] font-medium">
                  {hasOptions ? "원~" : "원"}
                </span>
              </span>
            </div>

            <div className="flex items-center gap-[4px]">
              <span className="text-[12px] font-medium leading-[20px] text-ink-900">
                포인트 사용시
              </span>
              <span className="text-[12px] font-medium leading-[20px] text-mint-500">
                {pointPrice.toLocaleString()}
              </span>
              <span className="relative inline-block size-[14px]">
                <img src={pointBadge} alt="" className="absolute inset-0 size-[14px]" />
                <span className="absolute inset-0 text-center text-[12px] font-medium leading-[14px] text-mint-300">
                  s
                </span>
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggleLike}
          aria-pressed={liked}
          aria-label={liked ? "찜 해제" : "찜하기"}
          className="w-fit"
        >
          <img
            src={liked ? heartFilled : heartOutline}
            alt=""
            className="size-[20px]"
          />
        </button>
      </div>
    </li>
  );
}
