const STEP = {
  INFO: 1, // 성별·나이
  SKIN: 4, // 피부 타입
  PURPOSE: 5, // 관리 목표
};

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

export function findMissingStep({ gender, skinType, purpose }) {
  if (!gender) return STEP.INFO;
  if (!skinType) return STEP.SKIN;
  if (!purpose) return STEP.PURPOSE;

  return null;
}

export function formatTime(value) {
  if (!value) return null;

  return value.slice(0, 5);
}
