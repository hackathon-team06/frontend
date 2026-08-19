import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import useOnboardingStore from "../../store/useOnboardingStore";
import usePointStore from "../../store/usePointStore";
import { SKIN_TYPES, CATEGORIES } from "../../mocks/products";
import {
  getProducts,
  likeProduct,
  unlikeProduct,
} from "../../api/shop";
import PointBadge from "../../components/product/PointBadge";

import heartFilled from "../../assets/icons/heart_filled.png";
import heartOutline from "../../assets/icons/heart_outline.svg";

export default function Product() {
  const navigate = useNavigate();

  const mySkinType = useOnboardingStore((state) => state.skinType);
  const point = usePointStore((state) => state.point);
  const fetchPoint = usePointStore((state) => state.fetchPoint);

  const [skinType, setSkinType] = useState(mySkinType || "지성");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchPoint();
  }, [fetchPoint]);

  // point 변경 시 할인 금액 갱신
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts(skinType, category);

        setProducts(data);
      } catch (error) {
        console.log("상품 조회 실패: ", error);
        setProducts([]);
      }
    };

    fetchProducts();
  }, [skinType, category, point]);

  const handleToggleLike = async (product) => {
    try {
      if (product.liked) {
        await unlikeProduct(product.productId);
      } else {
        await likeProduct(product.productId);
      }

      setProducts((prevProducts) =>
        prevProducts.map((item) =>
          item.productId === product.productId
            ? { ...item, liked: !item.liked }
            : item,
        ),
      );
    } catch (error) {
      console.log("상품 찜 실패: ", error);
    }
  };

  return (
    <div className="flex min-h-full flex-col bg-ink-50">
      {/* 헤더 */}
      <header className="flex items-end justify-between px-[19px] pt-[39px]">
        <h1 className="logo-font text-[22px] text-mint-600">
          stay care
        </h1>

        <button
          type="button"
          onClick={() => navigate("/product/wishlist")}
          className="flex h-[32px] w-[100px] cursor-pointer items-center justify-between rounded-[26px] border border-ink-100 pl-[9px] pr-[11px]"
        >
          <span className="text-[16px] font-medium text-ink-900">
            찜한 상품
          </span>

          <img
            src={heartFilled}
            alt=""
            className="size-[17px]"
          />
        </button>
      </header>

      {/* 포인트 */}
      <p className="mt-[17px] px-[19px] text-right text-[20px] font-semibold text-ink-900">
        <span className="text-mint-600">
          {point.toLocaleString()}
        </span>
        P
      </p>

      {/* 피부 타입 필터 */}
      <section className="px-4">
        <h2 className="text-[18px] font-semibold text-ink-900">
          피부 타입
        </h2>

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
        <h2 className="mt-[19px] text-[18px] font-medium text-ink-900">
          추천 상품
        </h2>

        {products.length === 0 ? (
          <p className="py-[60px] text-center text-[14px] text-ink-500">
            해당 조건의 추천 상품을 준비 중이에요
          </p>
        ) : (
          <ul className="mt-[20px] grid grid-cols-2 gap-x-[10px] gap-y-[17px] pb-[24px]">
            {products.map((product) => (
              <ProductCard
                key={product.productId}
                product={product}
                liked={product.liked}
                onToggleLike={() =>
                  handleToggleLike(product)
                }
                onOpen={() =>
                  navigate(`/product/${product.productId}`)
                }
              />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function ProductCard({
  product,
  liked,
  onToggleLike,
  onOpen,
}) {
  const {
    name,
    price,
    discountRate,
    imageUrl,
    pointAppliedPrice,
  } = product;

  return (
    <li
      onClick={onOpen}
      className="flex cursor-pointer flex-col gap-[9px]"
    >
      {/* 상품 이미지 */}
      <div className="h-[176px] w-full overflow-hidden rounded-[5px] bg-mint-50">
        {imageUrl && (
          <img
            src={imageUrl}
            alt=""
            className="size-full object-cover"
          />
        )}
      </div>

      <div className="flex flex-col gap-[6px]">
        <div className="flex flex-col gap-[4px]">
          {/* 상품명 */}
          <p className="text-[12px] font-medium leading-[1.3] tracking-[0.6px] text-ink-900">
            {name}
          </p>

          <div>
            {/* 할인율 / 가격 */}
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
                  원
                </span>
              </span>
            </div>

            {/* 포인트 적용 가격 */}
            <div className="flex items-center gap-[4px]">
              <span className="text-[12px] font-medium leading-[20px] text-ink-900">
                포인트 사용시
              </span>

              <span className="text-[12px] font-medium leading-[20px] text-mint-500">
                {pointAppliedPrice.toLocaleString()}
              </span>

              <PointBadge />
            </div>
          </div>
        </div>

        {/* 찜 버튼 */}
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onToggleLike();
          }}
          aria-pressed={liked}
          aria-label={liked ? "찜 해제" : "찜하기"}
          className="flex size-[23px] cursor-pointer items-center justify-center"
        >
          {liked ? (
            <img
              src={heartFilled}
              alt=""
              className="size-[23px]"
            />
          ) : (
            <img
              src={heartOutline}
              alt=""
              style={{
                width: 16,
                height: 15,
              }}
            />
          )}
        </button>
      </div>
    </li>
  );
}