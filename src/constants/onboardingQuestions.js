import moistSkinIcon from "../assets/images/onboarding_motivation/moist_skin.png";
import calmTroubleIcon from "../assets/images/onboarding_motivation/calm_trouble.png";
import hydrationIcon from "../assets/images/onboarding_motivation/hydration.png";
import nutritionIcon from "../assets/images/onboarding_motivation/nutrition.png";
import homeHabitIcon from "../assets/images/onboarding_motivation/home_habit.png";
import ddayIcon from "../assets/images/onboarding_motivation/dday.png";

// 문항을 추가하려면 이 배열에 항목을 하나 넣는다. 컴포넌트는 건드리지 않아도 된다.
export const ONBOARDING_QUESTIONS = [
    {
        id: "age",
        type: "list",
        title: "사용자님의 나이가\n어떻게 되시나요?",
        titleTop: 163,
        rowHeight: 68,
        options: [
            { id: "15_20", label: "15~20세" },
            { id: "21_25", label: "21~25세" },
            { id: "26_30", label: "26~30세" },
            { id: "31_35", label: "31~35세" },
            { id: "36_over", label: "36세 이후" },
        ],
    },
    {
        id: "sleep",
        type: "list",
        title: "다음 중 평균적으로\n주무시는 시간을 골라주세요",
        titleTop: 166,
        rowHeight: 56,
        options: [
            { id: "4_5", label: "4시간~5시간" },
            { id: "5_6", label: "5시간~6시간" },
            { id: "6_7", label: "6시간~7시간" },
            { id: "7_8", label: "7시간~8시간" },
            { id: "8_over", label: "8시간 이상" },
        ],
    },
    {
        id: "skin",
        type: "detail",
        title: "현재 피부 타입을 골라주세요",
        titleTop: 174,
        height: 1338,
        buttonTop: 1222,
        options: [
            {
                id: "dry",
                tag: "속당김/각질 주의",
                label: "건성피부",
                summary: "유수분이 부족해요",
                details: ["세안 후 피부가 팽팽하게 당기는 느낌이 들어요", "각질이 잘 들뜨고 건조함으로 홍조가 생겨요"],
            },
            {
                id: "oily",
                tag: "과다피지/트러블 고민",
                label: "지성 피부",
                summary: "피지 분비와 유분이 많아요",
                details: ["피부가 쉽게 번들거리고 화장이 잘 무너져요", "모공이 넓고 블랙헤드나 트러블이 자주 생겨요"],
            },
            {
                id: "combination",
                tag: "T존번들/U존건조",
                label: "복합성 피부",
                summary: "부위별 유수분 균형이 달라요",
                details: ["이마와 코(T존)는 피지로 쉽게 번들거려요", "볼과 턱(U존)은 건조해서 당김이 느껴져요"],
            },
            {
                id: "normal",
                tag: "유수분 밸런스 굿",
                label: "중성 피부",
                summary: "피부 유수분 균형이 완벽해요",
                details: ["당김이나 번들거림 없이 피부 결이 매끄러워요", "큰 트러블 없이 피부에 건강한 윤기가 돌아요"],
            },
            {
                id: "dehydrated_oily",
                tag: "겉유분/속건조",
                label: "수분부족지성",
                summary: "겉은 기름지고 속은 건조해요",
                details: ["피부 표면은 유분으로 번들거리지만 속은 당겨요", "보습을 조금만 놓쳐도 속당김과 트러블이 생겨요"],
            },
        ],
    },
    {
        id: "outing",
        type: "list",
        title: "다음 중 정기적으로\n외출하는 횟수을 골라주세요",
        titleTop: 166,
        rowHeight: 68,
        options: [
            { id: "weekly_1", label: "주 1회" },
            { id: "weekly_2_3", label: "주 2~3회" },
            { id: "weekly_4_5", label: "주 4~5회" },
            { id: "weekly_5_over", label: "주 5회 이상" },
        ],
    },
    {
        id: "cycle",
        type: "list",
        title: "어느정도의 주기로\n체크 받고 싶으신가요?",
        titleTop: 166,
        rowHeight: 68,
        options: [
            { id: "7d", label: "7일" },
            { id: "14d", label: "14일" },
            { id: "21d", label: "21일" },
            { id: "28d", label: "28일" },
        ],
    },
    {
        id: "motivation",
        type: "grid",
        title: "건강관리를 시작하게 된\n계기는 무엇인가요?",
        titleTop: 152,
        mascotTop: 66,
        arrowTop: 112,
        options: [
            { id: "moist_skin", label: "촉촉한 피부", icon: moistSkinIcon, iconSize: 28, iconTop: 21 },
            { id: "calm_trouble", label: "트러블/열감 진정", icon: calmTroubleIcon, iconSize: 33, iconTop: 16 },
            { id: "hydration", label: "수분 챙기기", icon: hydrationIcon, iconSize: 28, iconTop: 29 },
            { id: "nutrition", label: "영양 챙기기", icon: nutritionIcon, iconSize: 40, iconTop: 16 },
            { id: "home_habit", label: "귀가 후 습관 형성", icon: homeHabitIcon, iconSize: 41, iconTop: 14 },
            { id: "dday", label: "D-DAY 약속", icon: ddayIcon, iconSize: 40, iconTop: 18 },
        ],
    },
];
