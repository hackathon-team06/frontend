/**
 * 온보딩 입력값 ↔ 서버 값 변환.
 *
 * 온보딩 스토어는 화면에 맞춘 이름과 타입으로 값을 들고 있어서,
 * 서버로 보내기 전에 여기서 한 번 모양을 맞춥니다.
 */

/** 온보딩 단계 번호. Onboarding.jsx 의 page 번호와 같습니다. */
const STEP = {
  INFO: 1, // 성별 · 나이
  SKIN: 4, // 피부 타입
  PURPOSE: 5, // 관리 목표
};

/**
 * 온보딩 스토어 값을 진단 API 요청 모양으로 바꿉니다.
 *
 * 성별·피부타입·목표는 온보딩에서 서버 enum 과 똑같은 한국어 문자열로
 * 저장하고 있어 그대로 보냅니다. 실제로 바꿔야 하는 값은 주기뿐입니다.
 * (온보딩은 숫자 7, 서버는 문자열 "7일")
 */
export function toDiagnosisRequest({
  gender,
  age,
  skinType,
  morningTime,
  eveningTime,
  routine,
  purpose,
}) {
  return {
    gender,
    age,
    skinType,
    wakeUpTime: morningTime,
    returnHomeTime: eveningTime,
    checkCycle: `${routine}일`,
    careMotivation: purpose,
  };
}

/**
 * 진단에 필요한 값이 다 모였는지 확인합니다.
 *
 * 빠진 값이 있으면 돌아가야 할 온보딩 페이지 번호를, 다 모였으면 null 을
 * 돌려줍니다. 나이·시간은 스토어에 기본값이 있어 비지 않습니다.
 */
export function findMissingStep({ gender, skinType, purpose }) {
  if (!gender) return STEP.INFO;
  if (!skinType) return STEP.SKIN;
  if (!purpose) return STEP.PURPOSE;

  return null;
}

/**
 * 서버가 주는 시간을 화면용으로 줄입니다. ("06:00:00" → "06:00")
 *
 * Swagger 문서에는 LocalTime 이 객체로 적혀 있지만 실제 응답은 문자열입니다.
 */
export function formatTime(value) {
  if (!value) return null;

  return value.slice(0, 5);
}
