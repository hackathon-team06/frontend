import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getProductDetail } from "../../api/productDetail";
import useWishStore from "../../store/useWishStore";
import useLayoutStore from "../../store/useLayoutStore";
import usePointStore from "../../store/usePointStore";
import { getPointPrice } from "../../constants/product";

import PointBadge from "../../components/product/PointBadge";
import OptionSelector from "../../components/product/OptionSelector";
import WishToast from "../../components/product/WishToast";
import PartnerLoading from "../../components/product/PartnerLoading";

import heartFilled from "../../assets/icons/heart_filled.png";
import heartOutline from "../../assets/icons/heart_outline.svg";
import arrowBack from "../../assets/icons/arrow_back.svg";
import star from "../../assets/icons/star.png";

const CART_BUTTON_LABEL = "찜한 제품";

/** 알림이 떠 있는 시간 */
const TOAST_DURATION = 3000;

export default function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const detail = useMemo(() => getProductDetail(productId), [productId]);

  const likedIds = useWishStore((state) => state.likedIds);
  const toggleLike = useWishStore((state) => state.toggleLike);
  const setHideFooter = useLayoutStore((state) => state.setHideFooter);
  const point = usePointStore((state) => state.point);

  // 고른 옵션은 id 로만 들고 있고 실제 옵션은 계산해서 씁니다.
  // 이렇게 하면 다른 상품으로 이동했을 때 자동으로 첫 옵션이 선택됩니다.
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [toast, setToast] = useState(null);
  const [isMovingToPartner, setIsMovingToPartner] = useState(false);

  // 상세 화면은 하단 탭바 대신 액션바를 씁니다.
  useEffect(() => {
    setHideFooter(true);
    return () => setHideFooter(false);
  }, [setHideFooter]);

  // 알림은 3초 뒤 사라집니다.
  useEffect(() => {
    if (!toast) return undefined;

    const timer = setTimeout(() => setToast(null), TOAST_DURATION);
    return () => clearTimeout(timer);
  }, [toast]);

  const selectedOption =
    detail?.options.find((option) => option.id === selectedOptionId) ??
    detail?.options[0] ??
    null;

  if (!detail || !selectedOption) {
    return (
      <div className="flex min-h-full items-center justify-center bg-ink-50">
        <p className="text-[14px] text-ink-500">상품을 찾을 수 없어요</p>
      </div>
    );
  }

  const liked = likedIds.includes(detail.id);

  const handleToggleLike = () => {
    toggleLike(detail.id);
    setToast({ liked: !liked });
  };

  const handlePurchase = () => {
    setIsMovingToPartner(true);
    // TODO(백엔드 연동): detail.partnerUrl 을 받아오면 해당 주소로 이동합니다.
    // 지금은 이동할 곳이 없어 안내 화면만 잠시 보여줍니다.
    setTimeout(() => setIsMovingToPartner(false), TOAST_DURATION);
  };

  return (
    <div className="relative flex min-h-full flex-col bg-ink-50">
      {/* 상품 이미지 */}
      <div className="relative h-[412px] w-full shrink-0 overflow-hidden bg-[#e8fade]">
        {detail.imageUrl && (
          <img
            src={detail.imageUrl}
            alt=""
            className="size-full object-cover"
          />
        )}

        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="뒤로 가기"
          className="absolute left-[17px] top-[11px] z-10 flex h-[32px] w-[16px] cursor-pointer items-center justify-center"
        >
          <img src={arrowBack} alt="" style={{ width: 9.5, height: 17.3 }} />
        </button>
      </div>

      <div className="px-[20px]">
        {/* 태그 */}
        <div className="mt-[12px] flex gap-[5px]">
          {detail.tags.map((tag) => (
            <span
              key={tag}
              className="flex h-[24px] items-center rounded-[4px] bg-ink-100 px-[6px] text-[12px] font-medium tracking-[-0.24px] text-ink-900"
            >
              {tag}
            </span>
          ))}
        </div>

        <h1 className="mt-[11px] text-[20px] font-medium leading-[20px] tracking-[-0.4px] text-ink-900">
          {detail.name}
        </h1>

        {/* 포인트 사용가 */}
        <p className="mt-[9px] flex items-center gap-[4px] text-[16px] font-medium leading-[20px] text-ink-900">
          포인트 사용시
          <span className="text-mint-500">
            {getPointPrice(selectedOption.price, point).toLocaleString()}
          </span>
          <PointBadge />
        </p>

        {/* 할인율 + 정가 */}
        <p className="mt-[15px] flex items-center gap-[6px] leading-[20px]">
          {detail.discountRate > 0 && (
            <span className="text-[18px] font-medium tracking-[-0.36px] text-sale">
              {detail.discountRate}%
            </span>
          )}
          {detail.originalPrice && (
            <span className="text-[16px] font-medium tracking-[-0.32px] text-ink-900">
              {detail.originalPrice.toLocaleString()}원
            </span>
          )}
        </p>

        <p className="mt-[10px] text-[24px] font-medium leading-[20px] tracking-[-0.48px] text-ink-900">
          {selectedOption.price.toLocaleString()}원
          {detail.hasOptions ? "~" : ""}
        </p>

        {detail.freeShipping && (
          <p className="mt-[13px] text-[12px] font-medium leading-[20px] text-ink-900">
            무료배송
          </p>
        )}

        {/* 적립 */}
        <div className="mt-[14px] flex items-center">
          <span className="text-[14px] font-medium leading-[20px] text-ink-900">
            적립
          </span>
          <span className="ml-[48px] flex size-[14px] items-center justify-center rounded-[7px] border border-mint-100 bg-[#e8fade] text-[12px] font-medium leading-[12px] text-mint-300">
            s
          </span>
          <span className="ml-[4px] text-[14px] font-medium leading-[20px] text-ink-900">
            상품 구매시{" "}
            <span className="text-mint-500">
              {detail.rewardPoint.toLocaleString()}포인트
            </span>{" "}
            적립
          </span>
          <Chevron />
        </div>

        {/* 평점 · 리뷰 */}
        <div className="mt-[11px] flex items-center">
          <span className="flex items-center gap-[3px] text-[14px] font-medium leading-[20px] text-ink-900">
            평점
            <span className="size-[2px] rounded-[2px] bg-ink-900" />
            리뷰
          </span>
          <img src={star} alt="" className="ml-[23px] size-[14px]" />
          <span className="ml-[3px] text-[14px] font-medium leading-[20px] text-ink-900">
            {detail.rating}
          </span>
          <span className="ml-[8px] h-[12px] w-px bg-ink-900" />
          <span className="ml-[4px] text-[14px] font-medium leading-[20px] text-ink-900">
            리뷰 {detail.reviewCount.toLocaleString()}
          </span>
          <Chevron />
        </div>
      </div>

      {/* 용량 · 수량 옵션 */}
      <div className="mt-[19px]">
        <OptionSelector
          detail={detail}
          selectedOption={selectedOption}
          onSelect={(option) => setSelectedOptionId(option.id)}
        />
      </div>

      {/* 하단 액션바 */}
      <div className="sticky bottom-0 z-20 mt-auto h-[100px] w-full shrink-0 rounded-t-[20px] bg-ink-50">
        {toast && (
          <div className="absolute bottom-[100px] left-0 flex w-full justify-center">
            <WishToast
              liked={toast.liked}
              onMove={() => navigate("/product/wishlist")}
            />
          </div>
        )}

        <button
          type="button"
          onClick={handleToggleLike}
          aria-pressed={liked}
          aria-label={liked ? "찜 해제" : "찜하기"}
          className="absolute left-[19px] top-[41px] flex size-[32px] cursor-pointer items-center justify-center"
        >
          {liked ? (
            <img src={heartFilled} alt="" className="size-[28px]" />
          ) : (
            <img src={heartOutline} alt="" style={{ width: 28, height: 26 }} />
          )}
        </button>

        <button
          type="button"
          onClick={() => navigate("/product/wishlist")}
          className="absolute left-[71px] top-[28px] h-[52px] w-[144px] cursor-pointer rounded-[10px] bg-mint-50 text-[18px] font-medium text-mint-600"
        >
          {CART_BUTTON_LABEL}
        </button>

        <button
          type="button"
          onClick={handlePurchase}
          className="absolute left-[226px] top-[27px] h-[52px] w-[144px] cursor-pointer rounded-[10px] bg-mint-600 text-[18px] font-medium text-ink-50"
        >
          구매하기
        </button>
      </div>

      {isMovingToPartner && <PartnerLoading />}
    </div>
  );
}

/** 적립 · 평점 행 오른쪽의 > 표시. 연결될 화면이 아직 없어 표시만 합니다. */
function Chevron() {
  return (
    <img
      src={arrowBack}
      alt=""
      className="ml-auto rotate-180"
      style={{ width: 5.9, height: 10.8 }}
    />
  );
}
