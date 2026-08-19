/* 하루에 수행하는 미션 개수 */
const MISSIONS_PER_DAY = 6;

/* 닉네임을 아직 정하지 않았을 때 보여줄 기본값 */
const DEFAULT_NICKNAME = "수분남";

/* 스탬프(코스) 더미 */
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
    completePoint: null, // 진행 중이면 "미정"으로 표시
  },
];

const daysInMonth = (year, month) => new Date(year, month, 0).getDate();

const toNumber = (year, month, day) => year * 10000 + month * 100 + day;

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

function statusOf(stampId, year, month, day) {
  const hash = (stampId * 7919 + year * 131 + month * 37 + day * 17) % 100;

  if (hash < 55) return "all"; // 전부 성공
  if (hash < 80) return "partial"; // 일부 성공
  return "none"; // 미참여
}

export function toProfile(user, fallback = {}) {
  const server = user ?? {};

  return {
    nickname: fallback.nickname || server.nickname || DEFAULT_NICKNAME,

    age: server.age ?? fallback.age ?? 24,

    skinTypeLabel: `${server.skinType || fallback.skinType || "지성"}피부`,

    goal:
      server.careMotivation || fallback.purpose || server.goal || "촉촉한 피부",

    profileImageUrl: server.profileImageUrl || null,

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

export function getStampStartMonth(stampId) {
  const stamp = STAMPS.find((item) => item.id === Number(stampId));

  if (!stamp) return null;

  return { year: stamp.startYear, month: stamp.startMonth };
}
