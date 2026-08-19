import { PRODUCTS } from "../mocks/products";

/**
 * 상품 상세 데이터.
 *
 * ─────────────────────────────────────────────────────────────
 * 백엔드 연동 시 이 파일만 교체하면 됩니다.
 * getProductDetail(productId) 이 아래와 같은 모양의 객체를 돌려주기만 하면
 * 화면(ProductDetail.jsx) 코드는 그대로 씁니다.
 *
 *   axios.get(`/products/${productId}`).then((res) => res.data)
 * ─────────────────────────────────────────────────────────────
 *
 * 지금은 상품 목록 더미 데이터에서 계산해 만들어 냅니다.
 */

/** 카테고리별 옵션 단위.
 *  디자인에는 토너 예시(mL)만 있어 나머지는 상품명 표기에 맞춰 정했습니다.
 *  amounts 의 첫 번째가 기준 용량이며, 상품 목록의 판매가가 이 용량의 가격입니다. */
const OPTION_UNITS = {
  "스킨/토너": { amounts: [500, 250], unit: "mL", per: 100, perLabel: "100mL당" },
  "에센스/앰플": { amounts: [50, 30], unit: "mL", per: 100, perLabel: "100mL당" },
  크림: { amounts: [50, 80], unit: "mL", per: 100, perLabel: "100mL당" },
  마스크팩: { amounts: [10, 30], unit: "매", per: 1, perLabel: "1매당" },
  영양제: { amounts: [60, 120], unit: "정", per: 1, perLabel: "1정당" },
};

/** 수량별 가격 배수.
 *  디자인 예시(18,900원 → 2개 31,900 / 3개 51,400 / 4개 66,400 / 5개 80,100)에서 뽑았습니다. */
const QUANTITY_MULTIPLIERS = [1, 1.688, 2.72, 3.513, 4.238];

const QUANTITIES = [1, 2, 3, 4, 5];

const roundTo100 = (value) => Math.round(value / 100) * 100;

/**
 * 기준 용량이 아닌 용량의 가격.
 *
 * 용량 비율을 그대로 곱하지 않고 0.9 제곱을 적용해, 용량이 클수록
 * 단위당 가격이 조금씩 저렴해지도록 했습니다. (반대로 작은 용량은 단위당 비쌉니다)
 */
function basePriceFor(price, amount, baseAmount) {
  if (amount === baseAmount) return price;
  return roundTo100(price * (amount / baseAmount) ** 0.9);
}

function buildOptions(product) {
  const { amounts, unit, per, perLabel } = OPTION_UNITS[product.category];

  return amounts.flatMap((amount) => {
    const base = basePriceFor(product.price, amount, amounts[0]);

    return QUANTITIES.map((quantity) => {
      const price = roundTo100(base * QUANTITY_MULTIPLIERS[quantity - 1]);
      // 단위당 가격 = 총 가격 ÷ (용량 × 수량 ÷ 기준단위)
      const unitPrice = Math.round(price / ((amount * quantity) / per));

      return {
        id: `${amount}-${quantity}`,
        amount,
        amountLabel: `${amount}${unit}`,
        quantity,
        price,
        unitPrice,
        unitPriceLabel: `${perLabel} ${unitPrice.toLocaleString()}원`,
      };
    });
  });
}

export function getProductDetail(productId) {
  const product = PRODUCTS.find((item) => item.id === Number(productId));

  if (!product) return null;

  const options = buildOptions(product);
  const amountLabels = [...new Set(options.map((option) => option.amountLabel))];

  return {
    ...product,

    // 상품명 위 태그
    tags: [`${product.skinTypes[0]}피부`, "20대 구매 1위"],

    // 할인 전 가격. 판매가와 할인율에서 역산합니다. (18,900원 / 30% → 27,000원)
    originalPrice:
      product.discountRate > 0
        ? roundTo100(product.price / (1 - product.discountRate / 100))
        : null,

    freeShipping: true,

    // 적립 포인트. 디자인 예시(18,900원 → 308포인트) 비율을 따랐습니다.
    rewardPoint: Math.round(product.price * 0.0163),


    amountLabels,
    options,

    // TODO(백엔드 연동): 구매하기 클릭 시 이동할 제휴사 URL
    partnerUrl: null,
  };
}
