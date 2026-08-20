export const getUserIdFromToken = (accessToken) => {
  if (!accessToken) return null;

  try {
    const payload = accessToken.split(".")[1];
    const decodedPayload = JSON.parse(atob(payload));

    return Number(decodedPayload.sub);
  } catch (error) {
    console.error("사용자 ID 확인 실패:", error);
    return null;
  }
};
