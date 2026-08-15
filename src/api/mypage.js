/**
 * 마이페이지 데이터.
 *
 * ─────────────────────────────────────────────────────────────
 * 백엔드 연동 시 이 파일만 교체하면 됩니다.
 * 아래 세 함수가 같은 모양의 값을 돌려주기만 하면 화면 코드는 그대로 씁니다.
 *
 *   getMyProfile()                          → 프로필
 *   getStamps()                             → 스탬프(코스) 목록
 *   getStampCalendar(stampId, year, month)  → 월별 캘린더 + 요약
 * ─────────────────────────────────────────────────────────────
 *
 * 나이·피부타입·목표는 온보딩 스토어 값을 쓰고, 나머지는 더미입니다.
 */

/** 하루에 수행하는 미션 개수. 총 미션 수 = 코스 일수 × 이 값 */
const MISSIONS_PER_DAY = 6;

/** 닉네임을 아직 정하지 않았을 때 보여줄 기본값 */
const DEFAULT_NICKNAME = "수분남";

/** 스탬프(코스) 더미. 날짜는 데모가 흔들리지 않도록 고정해 두었습니다. */
const STAMPS = [
  {
    id: 1,
    startYear: 2026,
    startMonth: 5,
    startDay: 1,
    courseDays: 28,
    status: "done",
    doneMissions: 104,
    dailyPoint: 136,
    completePoint: 80,
  },
  {
    id: 2,
    startYear: 2026,
    startMonth: 7,
    startDay: 26,
    courseDays: 14,
    status: "ongoing",
    doneMissions: 18,
    dailyPoint: 24,
    completePoint: null, // 진행 중이면 "미정"으로 표시합니다.
  },
];

const daysInMonth = (year, month) => new Date(year, month, 0).getDate();

const toNumber = (year, month, day) => year * 10000 + month * 100 + day;

/** 코스 시작일 ~ 종료일을 YYYYMMDD 숫자로 반환합니다. */
function courseRange(stamp) {
  const start = new Date(stamp.startYear, stamp.startMonth - 1, stamp.startDay);
  const end = new Date(start);
  end.setDate(end.getDate() + stamp.courseDays - 1);

  return {
    start: toNumber(start.getFullYear(), start.getMonth() + 1, start.getDate()),
    end: toNumber(end.getFullYear(), end.getMonth() + 1, end.getDate()),
    startDate: start,
    endDate: end,
  };
}

/** 날짜별 달성 상태. 같은 날짜는 항상 같은 결과가 나오도록 계산합니다. */
function statusOf(stampId, year, month, day) {
  const hash = (stampId * 7919 + year * 131 + month * 37 + day * 17) % 100;

  if (hash < 55) return "all"; // 전부 성공
  if (hash < 80) return "partial"; // 일부 성공
  return "none"; // 미참여
}

export function getMyProfile({ nickname, age, skinType, purpose } = {}) {
  return {
    nickname: nickname || DEFAULT_NICKNAME,
    age: age || 24,
    // 온보딩은 "지성"처럼 저장하고 화면에는 "지성피부"로 보여줍니다.
    skinTypeLabel: `${skinType || "지성"}피부`,
    goal: purpose || "촉촉한 피부",
    // 가장 최근 진행 중인 코스의 경과 일수
    progressDay: 3,
  };
}

export function getStamps() {
  return STAMPS.map((stamp) => ({
    id: stamp.id,
    dateLabel: `${stamp.startMonth}/${stamp.startDay}`,
    courseLabel:
      stamp.status === "done" ? `${stamp.courseDays}DAY` : "진행중..",
    status: stamp.status,
  }));
}

export function getStampCalendar(stampId, year, month) {
  const stamp = STAMPS.find((item) => item.id === Number(stampId));

  if (!stamp) return null;

  const range = courseRange(stamp);
  const lastDay = daysInMonth(year, month);

  const days = Array.from({ length: lastDay }, (_, index) => {
    const day = index + 1;
    const current = toNumber(year, month, day);
    const inCourse = current >= range.start && current <= range.end;

    return {
      day,
      // 코스 기간 밖의 날짜는 색을 칠하지 않습니다.
      status: inCourse ? statusOf(stamp.id, year, month, day) : "outside",
    };
  });

  const prev = new Date(year, month - 2, 1);
  const next = new Date(year, month, 1);

  const overlapsCourse = (date) => {
    const first = toNumber(date.getFullYear(), date.getMonth() + 1, 1);
    const last = toNumber(
      date.getFullYear(),
      date.getMonth() + 1,
      daysInMonth(date.getFullYear(), date.getMonth() + 1),
    );

    return last >= range.start && first <= range.end;
  };

  return {
    year,
    month,
    days,
    firstWeekday: new Date(year, month - 1, 1).getDay(),
    totalMissions: stamp.courseDays * MISSIONS_PER_DAY,
    doneMissions: stamp.doneMissions,
    dailyPoint: stamp.dailyPoint,
    completePoint: stamp.completePoint,
    totalPoint: stamp.dailyPoint + (stamp.completePoint ?? 0),
    canPrev: overlapsCourse(prev),
    canNext: overlapsCourse(next),
  };
}

/** 스탬프의 시작 연·월. 캘린더를 처음 열 때 어느 달을 보여줄지 정합니다. */
export function getStampStartMonth(stampId) {
  const stamp = STAMPS.find((item) => item.id === Number(stampId));

  if (!stamp) return null;

  return { year: stamp.startYear, month: stamp.startMonth };
}
