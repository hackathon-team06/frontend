import { missionCategoryData } from "../constants/home/missionCategoryData";

/**
 * 미션 아이콘 정하기.
 *
 * 서버는 미션 문장만 주고 아이콘 정보를 주지 않습니다.
 * 아침 미션은 고정 아침 미션에 category 가 남아 있어 그것으로 정하고,
 * 저녁 미션은 AI 가 매번 새 문장을 만들어 카테고리가 없으므로 문장에서 짐작합니다.
 *
 * 아이콘은 모두 카테고리 이모지 9종에서 고릅니다.
 * assets 의 svg 는 목데이터 미션 6개에 맞춰 만든 것이라 서버가 만드는 문장을
 * 덮지 못하고, 일부만 svg 를 쓰면 한 화면에서 이모지와 그림이 섞입니다.
 *
 * MissionItem 은 missionIcons 에 없는 값이면 문자열을 그대로 그리므로
 * 이모지를 그냥 넘기면 됩니다.
 */

/**
 * 카테고리를 못 찾았을 때 쓰는 아이콘.
 *
 * 카테고리 9종 안에서 고릅니다. 밖의 기호를 쓰면 이것만 튀어 보입니다.
 * 진정/장벽은 어떤 스킨케어 문장에 붙어도 어색하지 않아 기본값으로 씁니다.
 */
export const DEFAULT_MISSION_ICON = "🌱";

/** 카테고리 한글 라벨 -> 이모지. ("수분/보습" -> "💧") */
const emojiByCategory = Object.fromEntries(
  missionCategoryData.map((category) => [category.name, category.emoji]),
);

const emojiOf = (categoryName) => emojiByCategory[categoryName];

/**
 * 문장에서 카테고리를 짐작하기 위한 키워드.
 *
 * 위에 있는 것부터 확인하므로 좁은 뜻을 앞에 둡니다.
 * "쿨링 패드로 진정" 은 크림·보습보다 "진정" 에 먼저 걸려야 하고,
 * "취침 전 스트레칭" 은 수면보다 "스트레칭" 에 먼저 걸려야 합니다.
 *
 * TODO(백엔드 연동): 저녁 미션 step 에도 category 가 붙으면 이 추측은 걷어냅니다.
 */
const ICON_RULES = [
  { category: "운동/스트레칭", words: ["스트레칭", "운동", "걷기", "산책"] },
  { category: "자외선 차단", words: ["자외선", "선크림", "차단제"] },
  {
    category: "진정/장벽",
    words: ["진정", "쿨링", "열감", "붉", "마사지", "붓기", "장벽", "팩"],
  },
  {
    category: "식습관/영양",
    words: ["영양제", "비타민", "아연", "채소", "과일", "식사", "챙겨먹"],
  },
  {
    category: "수분/보습",
    words: ["보습", "수분", "토너", "세럼", "에센스", "크림", "물 한 컵", "물 마시"],
  },
  { category: "수면/휴식", words: ["수면", "취침", "잠들", "휴식", "호흡"] },
    // "수건" 은 세안 문장에도 자주 붙어서 뺐습니다 ("수건으로 톡톡 말리기")
  { category: "위생 관리", words: ["베개", "이불", "환기", "습도", "청소"] },
  { category: "세안/클렌징", words: ["세안", "클렌", "씻", "닦"] },
];

/** 미션 문장에서 아이콘을 짐작합니다. */
export function guessIconFromContent(content = "") {
  const matched = ICON_RULES.find((rule) =>
    rule.words.some((word) => content.includes(word)),
  );

  return matched ? emojiOf(matched.category) : DEFAULT_MISSION_ICON;
}

/** 카테고리 한글 라벨에 맞는 이모지를 돌려줍니다. 없으면 문장에서 짐작합니다. */
export function iconFromCategory(category, content = "") {
  return emojiOf(category) ?? guessIconFromContent(content);
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
