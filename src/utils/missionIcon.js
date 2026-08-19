import { missionCategoryData } from "../constants/home/missionCategoryData";

export const DEFAULT_MISSION_ICON = "🌱";

const emojiByCategory = Object.fromEntries(
  missionCategoryData.map((category) => [category.name, category.emoji]),
);

const ICON_RULES = [
  { icon: "💊", words: ["영양제", "비타민", "아연", "유산균", "챙겨먹"] },
  { icon: "🏃", words: ["스트레칭", "운동", "걷기", "산책"] },
  { icon: "☀️", words: ["자외선", "선크림", "차단제"] },
  { icon: "💆", words: ["마사지", "붓기", "림프", "지압"] },
  { icon: "🧊", words: ["쿨링", "진정", "열감", "붉", "팩"] },
  { icon: "🥗", words: ["채소", "과일", "샐러드", "식사", "식단"] },
  { icon: "📱", words: ["휴대폰", "핸드폰", "화면"] },
  {
    icon: "💧",
    words: [
      "보습",
      "수분",
      "토너",
      "세럼",
      "에센스",
      "크림",
      "물 한 컵",
      "물 마시",
    ],
  },
  { icon: "😴", words: ["수면", "취침", "잠들", "휴식", "호흡"] },
  { icon: "🛏️", words: ["베개", "이불", "환기", "습도", "청소"] },
  { icon: "🧼", words: ["세안", "클렌", "씻", "닦"] },
];

function matchIconFromContent(content = "") {
  const matched = ICON_RULES.find((rule) =>
    rule.words.some((word) => content.includes(word)),
  );

  return matched ? matched.icon : null;
}

export function guessIconFromContent(content = "") {
  return matchIconFromContent(content) ?? DEFAULT_MISSION_ICON;
}

export function iconFromCategory(category, content = "") {
  return (
    matchIconFromContent(content) ??
    emojiByCategory[category] ??
    DEFAULT_MISSION_ICON
  );
}

export function toCategoryByContent(routine) {
  return Object.fromEntries(
    (routine?.items ?? [])
      .filter((item) => item.category)
      .map((item) => [item.content, item.category]),
  );
}
