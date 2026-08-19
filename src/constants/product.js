export const SKIN_TYPES = ["건성", "지성", "복합성", "수부지", "중성"];

export const CATEGORIES = [
  "스킨/토너",
  "에센스/앰플",
  "크림",
  "마스크팩",
  "영양제",
];

export const getPointPrice = (price, point) => Math.max(0, price - point);


export const WISHLIST_CATEGORIES = [
  { label: "전체", value: null },
  ...CATEGORIES.map((category) => ({ label: category, value: category })),
];
