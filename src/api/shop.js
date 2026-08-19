import api from "./axios";

// 상품 조회
export const getProducts = async (skinType, category) => {
  const response = await api.get("/api/shopping/products", {
    params: {
      skinType,
      category,
    },
  });

  return response.data;
};

// 상품 찜
export const likeProduct = async (productId) => {
  const response = await api.post(`/api/shopping/products/${productId}/likes`);
  return response.data;
};

// 상품 찜 취소
export const unlikeProduct = async (productId) => {
  const response = await api.delete(
    `/api/shopping/products/${productId}/likes`,
  );
  return response.data;
};

// 찜한 상품 조회
export const getLikedProducts = async (category) => {
  const response = await api.get("/api/shopping/likes", {
    params: category ? { category } : {},
  });

  return response.data;
};

// 랜덤 추천 상품 5개 조회
export const getRandomProducts = async () => {
  const response = await api.get("/api/shopping/products/random");
  return response.data;
};
