import { CATEGORIES } from "../mocks/products";

/**
 * 포인트 사용시 가격 = 판매가 - 보유 포인트
 *
 * 보유 포인트는 미션 완료로 늘어나므로 usePointStore 에서 읽어 넘겨주세요.
 */
export const getPointPrice = (price, point) => Math.max(0, price - point);

/**
 * 찜한 상품 화면의 카테고리 칩.
 *
 * 제품 목록 화면과 같은 분류를 쓰되 맨 앞에 "전체"를 둡니다.
 * value 가 null 이면 전체를 의미합니다.
 *
 * CATEGORIES 는 현재 mocks 에 있습니다. API 연동으로 mocks 를 지울 때
 * 이 파일로 옮겨오면 됩니다.
 */
export const WISHLIST_CATEGORIES = [
  { label: "전체", value: null },
  ...CATEGORIES.map((category) => ({ label: category, value: category })),
];
