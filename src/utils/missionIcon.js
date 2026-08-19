import { missionCategoryData } from "../constants/home/missionCategoryData";

/**
 * 미션 아이콘 정하기.
 *
 * 서버는 미션 문장만 주고 아이콘 정보를 주지 않습니다.
 * 그래서 문장에 들어간 단어로 아이콘을 고릅니다.
 *
 * 카테고리(수분/보습, 식습관/영양 ...)는 9개뿐이라 미션 하나하나를 나타내기엔
 * 너무 큽니다. "식습관/영양" 에는 영양제도 채소도 들어가는데 카테고리 이모지
 * 하나(🥗)로 묶으면 "영양제 챙겨먹기" 가 샐러드가 됩니다.
 * 그래서 문장을 먼저 보고, 단서를 못 찾은 아침 미션만 카테고리로 채웁니다.
 *
 * MissionItem 은 missionIcons 에 없는 값이면 문자열을 그대로 그리므로
 * 이모지를 그냥 넘기면 됩니다.
 */

/**
 * 아무 단서도 못 찾았을 때 쓰는 아이콘.
 *
 * 진정/장벽은 어떤 스킨케어 문장에 붙어도 어색하지 않아 기본값으로 씁니다.
 */
export const DEFAULT_MISSION_ICON = "🌱";

/** 카테고리 한글 라벨 -> 이모지. ("수분/보습" -> "💧") */
const emojiByCategory = Object.fromEntries(
  missionCategoryData.map((category) => [category.name, category.emoji]),
);


/**
 * 문장에 들어간 단어로 고르는 아이콘.
 *
 * 위에 있는 것부터 확인하므로 좁은 뜻을 앞에 둡니다.
 * "세안 후 보습제를 바르기" 는 조건(세안)이 아니라 행동(보습)을 봐야 하고,
 * "취침 전 스트레칭" 은 수면보다 스트레칭에 먼저 걸려야 합니다.
 *
 * 이모지는 추천 미션(recommendedMissionData)이 쓰는 것과 맞췄습니다.
 *
 * TODO(백엔드 연동): 미션 step 에 아이콘이나 세부 분류가 붙으면 이 추측은 걷어냅니다.
 */
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
  // "수건" 은 세안 문장에도 자주 붙어서 뺐습니다 ("수건으로 톡톡 말리기")
  { icon: "🛏️", words: ["베개", "이불", "환기", "습도", "청소"] },
  { icon: "🧼", words: ["세안", "클렌", "씻", "닦"] },
];

/** 문장에서 아이콘을 찾습니다. 단서가 없으면 null 입니다. */
function matchIconFromContent(content = "") {
  const matched = ICON_RULES.find((rule) =>
    rule.words.some((word) => content.includes(word)),
  );

  return matched ? matched.icon : null;
}

/** 저녁 미션처럼 카테고리가 없는 미션의 아이콘. */
export function guessIconFromContent(content = "") {
  return matchIconFromContent(content) ?? DEFAULT_MISSION_ICON;
}

/**
 * 아침 미션 아이콘.
 *
 * 문장이 카테고리보다 구체적이라 문장을 먼저 보고,
 * 단서가 없을 때만 카테고리 이모지로 채웁니다.
 */
export function iconFromCategory(category, content = "") {
  return (
    matchIconFromContent(content) ??
    emojiByCategory[category] ??
    DEFAULT_MISSION_ICON
  );
}

/**
 * 고정 아침 미션 목록을 "문장 -> 카테고리 라벨" 로 바꿉니다.
 *
 * 오늘 아침 미션(GET /api/missions/today)의 steps 는 고정 아침 미션의 content 를
 * 그대로 복사한 값이라 문장으로 카테고리를 되찾을 수 있습니다.
 * 직접 추가한 미션(source: CUSTOM)은 category 가 null 이라 빠집니다.
 */
export function toCategoryByContent(routine) {
  return Object.fromEntries(
    (routine?.items ?? [])
      .filter((item) => item.category)
      .map((item) => [item.content, item.category]),
  );
}
