import drySkin from "../assets/images/dry_skin.svg";
import oilySkin from "../assets/images/oily_skin.svg";
import normalSkin from "../assets/images/normal_skin.svg";
import combinationSkin from "../assets/images/combination_skin.svg";
import dehydratedSkin from "../assets/images/dehydrated_skin.svg";
import waterIcon from "../assets/icons/water_icon.svg";
import promiseIcon from "../assets/icons/promise_icon.svg";
import restIcon from "../assets/icons/rest_icon.svg";
import habitIcon from "../assets/icons/habit_icon.svg";
import cupIcon from "../assets/icons/cup_icon.svg";
import nutrientIcon from "../assets/icons/nutrient_icon.svg";

// 성별
export const GENDER = [
  {
    label: "여성",
    value: "female",
  },
  {
    label: "남성",
    value: "male",
  },
];

// 나이 : 1세부터 80세까지로
export const AGE = [];

for (let i = 1; i <= 80; i++) {
  AGE.push(i);
}

// 피부 타입 : 건성, 중성, 지성, 복합성, 수부지
export const SKINTYPE = [
  {
    id: "dry",
    img: drySkin,
    type: "건성",
    explain: "세안 후 피부가 당기고\n건조함을 자주 느껴요",
  },
  {
    id: "normal",
    img: normalSkin,
    type: "중성",
    explain: "유분과 건조함이\n비교적 균형 잡혀있어요",
  },
  {
    id: "oily",
    img: oilySkin,
    type: "지성",
    explain: "유분과 번들거림이\n자주 느껴져요",
  },
  {
    id: "combination",
    img: combinationSkin,
    type: "복합성",
    explain: "부위에 따라 건조함과\n유분감이 달라요",
  },
  {
    id: "dehydrated",
    img: dehydratedSkin,
    type: "수부지",
    explain: "겉은 번들거리나\n속은 당기고 건조해요",
  },
];

// 가장 원하는 변화
export const changes = [
    {
        id: "water",
        title: "촉촉한 피부",
        img: waterIcon,
    },
    {
        id: "promise",
        title: "D-DAY 약속",
        img: promiseIcon,
    },
    {
        id: "rest",
        title: "트러블/열감 진정",
        img: restIcon,
    },
    {
        id: "habit",
        title: "귀가 후 습관 형성",
        img: habitIcon,
    },
    {
        id: "cup",
        title: "수분 챙기기",
        img: cupIcon,
    },
    {
        id: "nutrient",
        title: "영양 챙기기",
        img: nutrientIcon,
    },
];