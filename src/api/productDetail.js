import api from "./axios";

const OPTION_UNITS = {
  "스킨/토너": { amounts: [500, 250], unit: "mL", per: 100, perLabel: "100mL당" },
  "에센스/앰플": { amounts: [50, 30], unit: "mL", per: 100, perLabel: "100mL당" },
  크림: { amounts: [50, 80], unit: "mL", per: 100, perLabel: "100mL당" },
  마스크팩: { amounts: [10, 30], unit: "매", per: 1, perLabel: "1매당" },
  영양제: { amounts: [60, 120], unit: "정", per: 1, perLabel: "1정당" },
};

const QUANTITY_MULTIPLIERS = [1, 1.688, 2.72, 3.513, 4.238];

const QUANTITIES = [1, 2, 3, 4, 5];

const roundTo100 = (value) => Math.round(value / 100) * 100;

function basePriceFor(price, amount, baseAmount) {
  if (amount === baseAmount) return price;
  return roundTo100(price * (amount / baseAmount) ** 0.9);
}

function buildOptions(product) {
  const units = OPTION_UNITS[product.category];

  if (!units) return [];

  const { amounts, unit, per, perLabel } = units;

  return amounts.flatMap((amount) => {
    const base = basePriceFor(product.price, amount, amounts[0]);

    return QUANTITIES.map((quantity) => {
      const price = roundTo100(base * QUANTITY_MULTIPLIERS[quantity - 1]);
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

// 상품 상세 조회
export async function getProductDetail(productId) {
  const response = await api.get(`/api/shopping/products/${productId}`);

  const product = response.data;

  const options = buildOptions(product);
  const amountLabels = [...new Set(options.map((option) => option.amountLabel))];

  return {
    ...product,

    tags: [`${product.skinTypes?.[0] ?? ""}피부`, "20대 구매 1위"].filter(
      (tag) => tag !== "피부",
    ),

    freeShipping: true,

    hasOptions: options.length > 0,

    amountLabels,
    options,
  };
}
