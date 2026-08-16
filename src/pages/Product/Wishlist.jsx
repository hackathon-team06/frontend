import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getLikedProducts, unlikeProduct } from "../../api/shop";
import { WISHLIST_CATEGORIES } from "../../constants/product";
import PointBadge from "../../components/product/PointBadge";
import ClearWishModal from "../../components/product/ClearWishModal";

import arrowBack from "../../assets/icons/arrow_back.svg";

export default function Wishlist() {
  const navigate = useNavigate();

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [hasAnyLiked, setHasAnyLiked] = useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  useEffect(() => {
    const fetchLikedProducts = async () => {
      try {
        const data = await getLikedProducts(category);
        setProducts(data);

        if (category === null) {
          setHasAnyLiked(data.length > 0);
        }
      } catch (error) {
        console.log("찜한 상품 조회 실패: ", error);
      }
    };

    fetchLikedProducts();
  }, [category]);

  const handleClear = async () => {
    try {
      await Promise.all(
        products.map((product) => unlikeProduct(product.productId)),
      );

      setProducts([]);
      setHasAnyLiked(false);
      setIsClearModalOpen(false);
    } catch (error) {
      console.log("찜한 상품 전체 삭제 실패: ", error);
    }
  };

  return (
    <div className="flex min-h-full flex-col bg-ink-50">
      {/* 헤더 */}
      <header className="relative h-[86px] shrink-0">
        <button
          type="button"
          onClick={() => navigate("/product")}
          aria-label="뒤로 가기"
          className="absolute left-[23px] top-[25px] z-10 flex h-[36px] w-[18px] cursor-pointer items-center justify-center"
        >
          <img
            src={arrowBack}
            alt=""
            style={{ width: 10.7, height: 19.46 }}
          />
        </button>

        <h1 className="pointer-events-none absolute top-[36px] w-full text-center text-[18px] font-medium text-ink-900">
          찜한 상품
        </h1>
      </header>

      {/* 카테고리 칩 */}
      <div className="no-scrollbar flex shrink-0 gap-[11px] overflow-x-auto px-[21px]">
        {WISHLIST_CATEGORIES.map(({ label, value }) => {
          const selected = value === category;

          return (
            <button
              key={label}
              type="button"
              onClick={() => setCategory(value)}
              aria-pressed={selected}
              className={`h-[32px] shrink-0 cursor-pointer rounded-[5px] px-[10px] text-[16px] font-medium ${
                selected
                  ? "bg-ink-900 text-ink-50"
                  : "border border-ink-300 text-ink-900"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* 총 개수 / 전체삭제 */}
      <div className="mt-[29px] flex shrink-0 items-center justify-between pl-[21px] pr-[17px]">
        <span className="text-[12px] font-medium tracking-[0.6px] text-ink-500">
          총 {products.length}개
        </span>

        <button
          type="button"
          onClick={() => setIsClearModalOpen(true)}
          disabled={products.length === 0}
          className="cursor-pointer text-[12px] font-medium tracking-[0.6px] text-ink-900 disabled:cursor-default disabled:text-ink-300"
        >
          전체삭제
        </button>
      </div>

      <div className="mt-[17px] h-px w-full shrink-0 bg-ink-300" />

      {/* 찜한 상품 목록 */}
      {products.length === 0 ? (
        <EmptyState hasAnyLiked={hasAnyLiked} />
      ) : (
        <ul className="flex flex-col gap-[21px] pb-[24px] pt-[12px]">
          {products.map((product) => (
            <WishlistItem
              key={product.productId}
              product={product}
              onOpen={() => navigate(`/product/${product.productId}`)}
            />
          ))}
        </ul>
      )}

      {isClearModalOpen && (
        <ClearWishModal
          onClose={() => setIsClearModalOpen(false)}
          onConfirm={handleClear}
        />
      )}
    </div>
  );
}

function WishlistItem({ product, onOpen }) {
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
      className="flex cursor-pointer gap-[14px] px-[21px]"
    >
      <div className="size-[75px] shrink-0 overflow-hidden rounded-[5px] bg-mint-50">
        {imageUrl && (
          <img
            src={imageUrl}
            alt=""
            className="size-full object-cover"
          />
        )}
      </div>

      <div className="flex h-[75px] flex-1 flex-col justify-between pr-[18px]">
        <p className="line-clamp-2 text-[12px] font-medium leading-[1.3] tracking-[0.6px] text-ink-900">
          {name}
        </p>

        <div className="flex items-center">
          {discountRate > 0 && (
            <span className="mr-[2px] text-[14px] font-semibold tracking-[-0.28px] text-sale">
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

          <span className="ml-auto flex items-center gap-[4px]">
            <span className="text-[14px] font-medium leading-[20px] text-mint-500">
              {pointAppliedPrice.toLocaleString()}
            </span>

            <PointBadge />
          </span>
        </div>
      </div>
    </li>
  );
}

function EmptyState({ hasAnyLiked }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-[8px] pb-[60px]">
      <p className="text-[16px] font-medium text-ink-900">
        {hasAnyLiked
          ? "이 카테고리에 찜한 상품이 없어요"
          : "아직 찜한 상품이 없어요"}
      </p>

      <p className="text-[12px] font-medium text-ink-500">
        {hasAnyLiked
          ? "다른 카테고리를 눌러보세요"
          : "마음에 드는 상품에 하트를 눌러보세요"}
      </p>
    </div>
  );
}