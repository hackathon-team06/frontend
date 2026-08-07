# 온보딩 진단 설문 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 로그인 직후 6개 문항의 진단 설문을 진행하고, 답변을 `localStorage`에 저장한 뒤 로딩 화면을 거쳐 `/home`으로 보낸다. 이미 마친 사용자는 로그인 후 곧바로 `/home`으로 간다.

**Architecture:** `/onboarding` 라우트 하나에 단계를 컴포넌트 내부 상태로 둔다. 문항은 데이터 배열로만 존재하고, 선택지 렌더러 3종(목록·상세·그리드)이 그 데이터를 그린다. 문항 추가는 배열 항목 하나 추가로 끝난다.

**Tech Stack:** React 19, react-router-dom 7, zustand 5 (`persist`), Tailwind CSS 4, Vite 8

**Spec:** [docs/superpowers/specs/2026-08-06-onboarding-survey-design.md](../specs/2026-08-06-onboarding-survey-design.md)

**Figma:** [설문 플로우 파일](https://www.figma.com/design/aoS5iGGARfUmDknJfwopdT/%EC%A0%9C%EB%AA%A9-%EC%97%86%EC%9D%8C?node-id=1-3&m=dev) (fileKey `aoS5iGGARfUmDknJfwopdT`)

**브랜치:** `feat/#10-questions-ui` (base: `develop` @ `40bc5f8`)

## Global Constraints

- 언어는 JavaScript(JSX). TypeScript를 설치하거나 `.tsx` 파일을 만들지 않는다.
- 스타일은 Tailwind CSS 유틸리티 클래스만 사용한다. `styled-components`나 별도 CSS 파일을 만들지 않는다.
- 수치는 기존 페이지들과 같이 임의값 표기(`w-[352px]`)를 쓴다. `w-88` 같은 캐논컬 변환을 하지 않는다. 에디터가 제안해도 적용하지 않는다.
- 폰트는 `src/index.css`에서 전역 적용돼 있다(`body`에 Pretendard Variable). 컴포넌트에 `font-['Pretendard_Variable']`을 붙이지 않는다. 굵기만 `font-medium` / `font-semibold`로 지정한다.
- 새 npm 패키지를 설치하지 않는다. `zustand`는 이미 의존성에 있다.
- 들여쓰기는 공백 4칸.
- 커밋 메시지는 README 컨벤션을 따른다 (`✨ Feat : `, `🎨 Design : ` 등).
- `git add`는 각 태스크가 명시한 경로만 사용한다. `git add -A` / `git add .` 금지 — 저장소에 커밋하면 안 되는 미추적 디렉터리가 있다.
- 상태바는 기존 `src/assets/images/phone.svg`를 재사용한다. 새로 내려받지 않는다.

  **정정(구현 후 확인됨):** 이 제약을 쓸 때 "`Home.jsx`·`Register.jsx`가 같은 방식으로 쓴다"고 적었으나 사실이 아니다. 두 파일은 `40bc5f8`(팀원의 홈 화면 일지 모달 작업)에서 `phone.svg` 사용을 제거했고, 이 계획이 작성된 시점에는 이미 아무도 쓰지 않는 에셋이었다. 결과적으로 설문 화면이 앱에서 유일하게 가짜 상태바를 그리는 화면이 됐다. 코드는 지시대로 구현됐으니 되돌릴 것은 없지만, 상태바를 설문에서 빼든 다른 화면에 넣든 디자인 결정이 필요하다.

### 시안에서 확정된 공통 값

| 요소 | 값 |
| :--- | :--- |
| 화면 배경 | 흰색 (`RootLayout` 안쪽이 이미 `bg-white`이므로 별도 지정 불필요) |
| 기본 프레임 높이 | 844px (피부 타입 문항만 1338px) |
| 마스코트 | 92×82, `left-[149px] top-[84px]` (계기 문항만 93×83, `top-[66px]`) |
| 문항 제목 | `text-[24px] font-semibold text-[#0F0F0F]`, 가운데 정렬, 줄높이 32px |
| 진행 바 | `left-[17px] top-[241px]`, flex `gap-[4px]`, 각 칸 `h-[4px] rounded-[2px]` |
| 진행 바 색 | 채움 `#78BAA9` / 빈칸 `#BFBEBE` |
| 뒤로가기 화살표 | 21×42, `left-[43px] top-[126px]` (계기 문항만 `top-[112px]`) |
| 하단 버튼 | `w-[352px] h-[52px] bg-[#65DBBE] rounded-[14px]`, `left-[19px] top-[750px]` |
| 버튼 문구 | `다음으로`, `text-[20px] font-semibold text-white`, 가운데 정렬 |

### 라디오 버튼 (CSS로 그린다)

SVG를 직접 확인한 결과 구조가 단순해서 이미지 대신 CSS로 만든다.

| 상태 | 구현 |
| :--- | :--- |
| 미선택 | `w-[18px] h-[18px] rounded-full border-2 border-[#EBEBEB] bg-white` |
| 선택 | 위와 같되 테두리가 `border-[#65DBBE]`이고, 안에 `w-[10px] h-[10px] rounded-full bg-[#65DBBE]` 점을 가운데 배치 |

테두리 2px + 안쪽 여백 2px + 점 10px = 18px으로 시안과 정확히 맞는다.

### 선택지 유형별 값

**목록형** — 나이 · 수면 · 외출 · 주기

| 항목 | 값 |
| :--- | :--- |
| 컨테이너 | `left-[19px] top-[283px] w-[352px]`, flex 세로, `gap-[11px]` |
| 행 | `w-[352px] rounded-[12px] bg-white border-2` |
| 행 높이 | 68px (수면 문항만 56px) |
| 미선택 테두리 | `#F0F0F0` |
| 선택 테두리 | `#65DBBE` |
| 라벨 | `text-[18px] font-medium text-[#0F0F0F]`, 좌측 여백 15px, 세로 가운데 |
| 라디오 | 우측 여백 19px, 세로 가운데 |

**상세형** — 피부 타입

| 항목 | 값 |
| :--- | :--- |
| 컨테이너 | `left-[17px] top-[283px] w-[352px]`, flex 세로, `gap-[11px]` |
| 카드 | `w-[352px] h-[168px] rounded-[12px] bg-white border-2` (테두리 색은 목록형과 동일) |
| 태그 | `h-[20px] bg-[#65DBBE] rounded-[4px] px-[4px]`, `left-[15px] top-[18px]`, `text-[12px] font-medium text-white` |
| 제목 | `text-[20px] font-medium text-[#0F0F0F]`, `left-[15px] top-[46px]` |
| 요약 | `text-[14px] font-medium text-[#0F0F0F]`, `left-[16px] top-[72px]` |
| 설명 2줄 | `text-[14px] font-medium text-black`, 불릿(`list-disc`), `left-[7px]` + `ms-[21px]`, `top-[102px]` / `top-[125px]` |
| 라디오 | `left-[315px] top-[72px]` |

**그리드형** — 건강관리 계기

| 항목 | 값 |
| :--- | :--- |
| 컨테이너 | `left-[16px] top-[264px] w-[358px]`, 2열 그리드, `gap-x-[14px] gap-y-[19px]` |
| 카드 | `w-[172px] h-[102px] rounded-[20px] border-2` |
| 미선택 | 테두리 `#F0F0F0`, 그림자 `0px 1px 1px 0px rgba(148,148,148,0.25)` |
| 선택 | 테두리 `#65DBBE`, 그림자 `0px 1px 1px 0px rgba(101,219,190,0.25)` |
| 라벨 | `text-[16px] font-medium text-[#0F0F0F] tracking-[-0.16px]`, 가운데, `top-[56px]`, 줄높이 28px |
| 아이콘 | 카드마다 크기·위치가 달라 문항 데이터에 개별 지정 |

**시안의 장식 하나는 재현하지 않는다.** 계기 카드 중 "촉촉한 피부"에만 아이콘 뒤에 타원(`Ellipse 13`, 60×51)이 깔려 있다. 미선택 프레임에도 똑같이 있으므로 선택 표시가 아니라 그 카드에만 붙은 장식이다. 여섯 카드 중 하나만 다르게 보이는 것이 의도인지 확인되지 않았으므로 넣지 않는다. 구현 후 디자이너에게 확인할 항목으로 보고한다.

### 테스트 방식

이 프로젝트에는 테스트 프레임워크가 없고 스펙에서 도입하지 않기로 했다. 각 태스크의 검증은 **`npm run build` · `npm run lint` · 수동 확인**이다. 테스트 파일을 만들지 않는다.

**구현자는 브라우저를 볼 수 없다.** 각 태스크의 수동 확인 항목은 사람이 수행하도록 보고서에 목록으로 남기고, dev 서버를 띄우지 않는다.

---

### Task 1: 기반 구조와 목록형 문항

문항 데이터, 스토어, 라우팅, 공통 화면 뼈대, 목록형 선택지까지 만든다. 이 태스크가 끝나면 나이·수면 문항이 실제로 동작한다. 피부·계기 문항은 선택지 영역이 비어 있고, 로딩 화면도 아직 없다 — 의도된 중간 상태다.

**Files:**
- Create: `src/store/onboardingStore.js`
- Create: `src/constants/onboardingQuestions.js`
- Create: `src/pages/Onboarding/Onboarding.jsx`
- Create: `src/pages/Onboarding/QuestionScreen.jsx`
- Create: `src/pages/Onboarding/OptionGroups.jsx`
- Create: `src/assets/images/onboarding_mascot.png`
- Create: `src/assets/icons/back_arrow.svg`
- Modify: `src/App.jsx`
- Modify: `src/layout/RootLayout.jsx`
- Modify: `src/pages/Main/Main.jsx`

**Interfaces:**
- Consumes: 기존 `useAuthStore`(`isLoggedIn`, `login`), 기존 `HIDE_FOOTER` 배열, 기존 `src/assets/images/phone.svg`
- Produces:
  - `ONBOARDING_QUESTIONS` — 문항 배열, `src/constants/onboardingQuestions.js`의 이름 있는 내보내기. 각 항목은 `{ id, title, titleTop, type, options }`이며 유형별 추가 필드를 갖는다.
  - `useOnboardingStore` — zustand 훅, 기본 내보내기. 상태 `answers: object`, `hasCompletedOnboarding: boolean`, 액션 `completeOnboarding(answers): void`
  - `QuestionScreen({ question, stepIndex, totalSteps, selectedId, onSelect, onBack, onNext })` — 문항 화면
  - `OptionGroups.jsx`의 `ListOptions({ question, selectedId, onSelect })`

- [ ] **Step 1: 에셋 두 개를 내려받는다**

Figma MCP의 `download_assets`를 두 번 호출한다. 스키마가 로드돼 있지 않으면 `ToolSearch`로 `select:mcp__figma__download_assets`를 먼저 부른다.

마스코트:
- `fileKey`: `aoS5iGGARfUmDknJfwopdT`
- `nodeId`: `1:1939`
- `defaultFormat`: `png`
- `defaultScale`: `2`

응답의 `export`를 `src/assets/images/onboarding_mascot.png`로 저장한다.

뒤로가기 화살표:
- `fileKey`: `aoS5iGGARfUmDknJfwopdT`
- `nodeId`: `1:1944`
- `defaultFormat`: `svg`

응답의 `export`를 `src/assets/icons/back_arrow.svg`로 저장한다.

에셋 URL은 수명이 짧으므로 받는 즉시 저장한다. 호출이 실패하면 멈추고 NEEDS_CONTEXT로 보고한다. 대체 이미지를 만들거나 직접 그리지 않는다.

계기 문항 아이콘 6개와 로딩 화면 이미지는 이 태스크에서 받지 않는다. Task 3·4에서 받는다.

- [ ] **Step 2: 두 파일이 저장됐는지 확인한다**

Run: `ls -la src/assets/images/onboarding_mascot.png src/assets/icons/back_arrow.svg`
Expected: 둘 다 존재하고 크기가 0이 아니다.

- [ ] **Step 3: 스토어를 만든다**

`src/store/onboardingStore.js`를 새로 만든다.

```js
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useOnboardingStore = create(
    persist(
        (set) => ({
            answers: {},
            hasCompletedOnboarding: false,
            completeOnboarding: (answers) => set({ answers, hasCompletedOnboarding: true }),
        }),
        { name: "staycare-onboarding" }
    )
);

export default useOnboardingStore;
```

`resetOnboarding`은 호출하는 곳이 없으므로 넣지 않는다.

- [ ] **Step 4: 문항 데이터를 만든다**

`src/constants/onboardingQuestions.js`를 새로 만든다. 문항 6개를 모두 여기에 넣는다 — 이 태스크에서 화면이 완성되는 건 목록형뿐이지만, 데이터는 한 번에 정의해 두어야 진행 바 칸 수와 단계 수가 처음부터 맞는다.

`title`의 `\n`은 줄바꿈 위치이며 시안 그대로다. 4번 문항 제목의 "횟수을"은 시안의 오타이나 임의로 고치지 않고 그대로 옮긴다(구현 후 보고 항목).

```js
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
            { id: "moist_skin", label: "촉촉한 피부", iconSize: 28, iconTop: 21 },
            { id: "calm_trouble", label: "트러블/열감 진정", iconSize: 33, iconTop: 16 },
            { id: "hydration", label: "수분 챙기기", iconSize: 28, iconTop: 29 },
            { id: "nutrition", label: "영양 챙기기", iconSize: 40, iconTop: 16 },
            { id: "home_habit", label: "귀가 후 습관 형성", iconSize: 41, iconTop: 14 },
            { id: "dday", label: "D-DAY 약속", iconSize: 40, iconTop: 18 },
        ],
    },
];
```

- [ ] **Step 5: 목록형 선택지 렌더러를 만든다**

`src/pages/Onboarding/OptionGroups.jsx`를 새로 만든다. 상세형·그리드형은 Task 2·3에서 이 파일에 추가한다.

```jsx
// 라디오 버튼 : 시안의 SVG 대신 CSS로 그린다
function Radio({ selected }) {
    return (
        <div className={`w-[18px] h-[18px] rounded-full border-2 bg-white flex items-center justify-center shrink-0
            ${selected ? "border-[#65DBBE]" : "border-[#EBEBEB]"}`}>
            {selected && <div className="w-[10px] h-[10px] rounded-full bg-[#65DBBE]" />}
        </div>
    );
}

export function ListOptions({ question, selectedId, onSelect }) {
    return (
        <div className="absolute left-[19px] top-[283px] w-[352px] flex flex-col gap-[11px]">
            {question.options.map((option) => (
                <button
                    key={option.id}
                    type="button"
                    onClick={() => onSelect(option.id)}
                    style={{ height: `${question.rowHeight}px` }}
                    className={`w-[352px] rounded-[12px] bg-white border-2 cursor-pointer
                        flex items-center justify-between pl-[15px] pr-[19px]
                        ${selectedId === option.id ? "border-[#65DBBE]" : "border-[#F0F0F0]"}`}
                >
                    <span className="text-[18px] font-medium text-[#0F0F0F]">{option.label}</span>
                    <Radio selected={selectedId === option.id} />
                </button>
            ))}
        </div>
    );
}
```

행 높이만 문항마다 다르므로(68px / 56px) `style`로 넘긴다. Tailwind는 런타임 값으로 클래스를 만들 수 없어 `h-[${...}]` 형태는 동작하지 않는다.

- [ ] **Step 6: 문항 화면 공통 뼈대를 만든다**

`src/pages/Onboarding/QuestionScreen.jsx`를 새로 만든다.

```jsx
import phone from "../../assets/images/phone.svg";
import mascot from "../../assets/images/onboarding_mascot.png";
import backArrow from "../../assets/icons/back_arrow.svg";

import { ListOptions } from "./OptionGroups";

export default function QuestionScreen({ question, stepIndex, totalSteps, selectedId, onSelect, onBack, onNext }) {

    const height = question.height ?? 844;
    const buttonTop = question.buttonTop ?? 750;
    const mascotTop = question.mascotTop ?? 84;
    const arrowTop = question.arrowTop ?? 126;

    return (
        <div className="relative w-[390px]" style={{ height: `${height}px` }}>
            <img src={phone} className="mt-2" />
            {/* 뒤로가기 : 첫 문항에는 없다 */}
            {stepIndex > 0 && (
                <img
                    src={backArrow}
                    className="absolute left-[43px] w-[21px] h-[42px] cursor-pointer"
                    style={{ top: `${arrowTop}px` }}
                    onClick={onBack}
                />
            )}
            <img
                src={mascot}
                className="absolute left-[149px] w-[92px] h-[82px]"
                style={{ top: `${mascotTop}px` }}
            />
            {/* 문항 제목 */}
            <p
                className="absolute left-0 w-[390px] px-[30px] text-[24px] font-semibold text-[#0F0F0F] text-center leading-[32px] whitespace-pre-line"
                style={{ top: `${question.titleTop}px` }}
            >
                {question.title}
            </p>
            {/* 진행 바 : 칸 수를 문항 개수에서 계산한다 */}
            <div className="absolute left-[17px] top-[241px] w-[356px] flex gap-[4px]">
                {Array.from({ length: totalSteps }, (_, index) => (
                    <div
                        key={index}
                        className={`flex-1 h-[4px] rounded-[2px] ${index <= stepIndex ? "bg-[#78BAA9]" : "bg-[#BFBEBE]"}`}
                    />
                ))}
            </div>
            {question.type === "list" && (
                <ListOptions question={question} selectedId={selectedId} onSelect={onSelect} />
            )}
            {/* 하단 버튼 : 답을 고르기 전에는 비활성 */}
            <button
                type="button"
                disabled={!selectedId}
                onClick={onNext}
                style={{ top: `${buttonTop}px` }}
                className="absolute left-[19px] w-[352px] h-[52px] bg-[#65DBBE] rounded-[14px]
                    text-[20px] font-semibold text-white
                    disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
                다음으로
            </button>
        </div>
    );
}
```

진행 바는 `flex-1`로 균등 분할한다. 문항이 6개일 때 `(356 - 4×5) / 6 = 56px`가 되어 시안과 같다. 문항이 늘어도 폭이 알아서 맞는다.

- [ ] **Step 7: 흐름 컨트롤러를 만든다**

`src/pages/Onboarding/Onboarding.jsx`를 새로 만든다.

```jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ONBOARDING_QUESTIONS } from "../../constants/onboardingQuestions";
import useAuthStore from "../../store/authStore";
import QuestionScreen from "./QuestionScreen";

export default function Onboarding() {

    const navigate = useNavigate();
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState({});

    // 로그아웃 상태로 이 화면에 남아 있으면 로그인 화면으로 되돌린다
    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/", { replace: true });
        }
    }, [isLoggedIn, navigate]);

    if (!isLoggedIn) {
        return null;
    }

    const question = ONBOARDING_QUESTIONS[step];

    const handleSelect = (optionId) => {
        setAnswers({ ...answers, [question.id]: optionId });
    };

    const handleNext = () => {
        setStep(step + 1);
    };

    const handleBack = () => {
        setStep(step - 1);
    };

    return (
        <QuestionScreen
            question={question}
            stepIndex={step}
            totalSteps={ONBOARDING_QUESTIONS.length}
            selectedId={answers[question.id]}
            onSelect={handleSelect}
            onBack={handleBack}
            onNext={handleNext}
        />
    );
}
```

마지막 문항에서 `handleNext`가 호출되면 `step`이 문항 개수와 같아져 `question`이 `undefined`가 된다. Task 4에서 로딩 화면 분기를 넣어 해결한다. **이 태스크의 수동 확인은 마지막 문항의 버튼을 누르지 않는 선까지만 한다.**

- [ ] **Step 8: 라우트를 추가한다**

`src/App.jsx`에 import와 라우트를 각각 한 줄 추가한다. 기존 라우트는 순서를 포함해 그대로 둔다.

import 목록 마지막에:

```jsx
import Onboarding from "./pages/Onboarding/Onboarding";
```

`<Route path="/register" ... />` 다음 줄에:

```jsx
          <Route path="/onboarding" element={<Onboarding />} />
```

- [ ] **Step 9: 설문 화면에서 탭바를 숨긴다**

`src/layout/RootLayout.jsx`의 `HIDE_FOOTER` 배열에 항목을 추가한다.

변경 전:

```jsx
const HIDE_FOOTER = ["/", "/register"];
```

변경 후:

```jsx
const HIDE_FOOTER = ["/", "/register", "/onboarding"];
```

이 파일에서 다른 줄은 건드리지 않는다.

- [ ] **Step 10: 로그인 성공 시 분기를 넣는다**

`src/pages/Main/Main.jsx`를 수정한다. import 한 줄, 훅 한 줄, 이동 경로 한 줄이 바뀐다.

import 목록에 추가:

```jsx
import useOnboardingStore from "../../store/onboardingStore";
```

`const login = useAuthStore((state) => state.login);` 다음 줄에 추가:

```jsx
    const hasCompletedOnboarding = useOnboardingStore((state) => state.hasCompletedOnboarding);
```

`handleSubmit`의 마지막 `navigate("/home");`를 바꾼다:

```jsx
        navigate(hasCompletedOnboarding ? "/home" : "/onboarding");
```

`Main.jsx`의 다른 부분은 건드리지 않는다. 특히 레이아웃 값(`h-[550px]`, `mt-[10px]`, `w-[360px]` 등)과 `e.preventDefault()` 위치는 그대로 둔다.

- [ ] **Step 11: 빌드와 린트를 확인한다**

Run: `npm run build`
Expected: PASS

Run: `npm run lint`
Expected: PASS

- [ ] **Step 12: 커밋**

```bash
git add src/store/onboardingStore.js src/constants/onboardingQuestions.js src/pages/Onboarding/Onboarding.jsx src/pages/Onboarding/QuestionScreen.jsx src/pages/Onboarding/OptionGroups.jsx src/assets/images/onboarding_mascot.png src/assets/icons/back_arrow.svg src/App.jsx src/layout/RootLayout.jsx src/pages/Main/Main.jsx
git commit -m "✨ Feat : 온보딩 설문 기반 구조 및 목록형 문항 구현"
```

- [ ] **Step 13: 사람이 확인할 항목을 보고서에 남긴다**

dev 서버를 띄우지 않는다. 다음 목록을 보고서에 그대로 적는다.

- 로그인하면 설문 1번 문항(나이)이 뜨고 하단 탭바가 보이지 않는다
- 1번 문항에는 뒤로가기 화살표가 없다
- 답을 고르기 전 하단 버튼이 흐리고 눌리지 않으며, 고르면 진해진다
- 선택한 행의 테두리가 민트색으로 바뀌고 라디오 안에 점이 생긴다
- "다음으로"를 누르면 2번 문항(수면)으로 가고 진행 바가 2칸 찬다. 행 높이가 1번보다 낮다
- 2번 문항에서 뒤로가기를 누르면 1번 문항으로 가고 골랐던 답이 남아 있다
- 3번 문항(피부)은 선택지 영역이 비어 있다 (Task 2에서 구현)

---

### Task 2: 상세형 문항 (피부 타입)

**Files:**
- Modify: `src/pages/Onboarding/OptionGroups.jsx`
- Modify: `src/pages/Onboarding/QuestionScreen.jsx`

**Interfaces:**
- Consumes: Task 1의 `Radio` 로컬 컴포넌트, `ONBOARDING_QUESTIONS`의 `skin` 항목(`tag`·`label`·`summary`·`details` 필드)
- Produces: `OptionGroups.jsx`의 `DetailOptions({ question, selectedId, onSelect })`

- [ ] **Step 1: 상세형 렌더러를 추가한다**

`src/pages/Onboarding/OptionGroups.jsx`의 `ListOptions` 아래에 추가한다. `Radio`는 이미 파일 안에 있으므로 다시 정의하지 않는다.

```jsx
export function DetailOptions({ question, selectedId, onSelect }) {
    return (
        <div className="absolute left-[17px] top-[283px] w-[352px] flex flex-col gap-[11px]">
            {question.options.map((option) => (
                <button
                    key={option.id}
                    type="button"
                    onClick={() => onSelect(option.id)}
                    className={`relative w-[352px] h-[168px] rounded-[12px] bg-white border-2 cursor-pointer text-left
                        ${selectedId === option.id ? "border-[#65DBBE]" : "border-[#F0F0F0]"}`}
                >
                    <span className="absolute left-[15px] top-[18px] h-[20px] px-[4px] bg-[#65DBBE] rounded-[4px]
                        flex items-center text-[12px] font-medium text-white">
                        {option.tag}
                    </span>
                    <span className="absolute left-[15px] top-[46px] text-[20px] font-medium text-[#0F0F0F]">
                        {option.label}
                    </span>
                    <span className="absolute left-[16px] top-[72px] text-[14px] font-medium text-[#0F0F0F]">
                        {option.summary}
                    </span>
                    <ul className="absolute left-[7px] top-[102px] text-[14px] font-medium text-black">
                        {option.details.map((detail) => (
                            <li key={detail} className="list-disc ms-[21px] h-[23px]">{detail}</li>
                        ))}
                    </ul>
                    <div className="absolute left-[315px] top-[72px]">
                        <Radio selected={selectedId === option.id} />
                    </div>
                </button>
            ))}
        </div>
    );
}
```

설명 두 줄은 시안에서 `top-102`와 `top-125`로 23px 간격이므로 각 항목 높이를 23px로 준다.

- [ ] **Step 2: 공통 뼈대에서 상세형을 연결한다**

`src/pages/Onboarding/QuestionScreen.jsx`의 import를 수정한다.

변경 전:

```jsx
import { ListOptions } from "./OptionGroups";
```

변경 후:

```jsx
import { ListOptions, DetailOptions } from "./OptionGroups";
```

그리고 `ListOptions` 렌더 블록 아래에 추가한다.

```jsx
            {question.type === "detail" && (
                <DetailOptions question={question} selectedId={selectedId} onSelect={onSelect} />
            )}
```

다른 부분은 건드리지 않는다. 프레임 높이 1338px과 버튼 위치 1222px는 Task 1에서 `question.height` / `question.buttonTop`으로 이미 처리돼 있다.

- [ ] **Step 3: 빌드와 린트를 확인한다**

Run: `npm run build`
Expected: PASS

Run: `npm run lint`
Expected: PASS

- [ ] **Step 4: 커밋**

```bash
git add src/pages/Onboarding/OptionGroups.jsx src/pages/Onboarding/QuestionScreen.jsx
git commit -m "✨ Feat : 온보딩 설문 피부 타입 문항 구현"
```

- [ ] **Step 5: 사람이 확인할 항목을 보고서에 남긴다**

- 3번 문항(피부 타입)에 카드 5개가 뜨고, 각 카드에 민트색 태그·제목·요약·불릿 2줄이 보인다
- 화면이 세로로 스크롤되고, 아래로 끝까지 내리면 "다음으로" 버튼이 나온다
- 카드를 누르면 테두리가 민트색으로 바뀌고 라디오에 점이 생긴다
- 4번 문항(외출)으로 넘어가면 다시 844px 화면이 되어 스크롤이 사라진다

---

### Task 3: 그리드형 문항 (건강관리 계기)

**Files:**
- Create: `src/assets/images/onboarding_motivation/` 아래 아이콘 6개
- Modify: `src/constants/onboardingQuestions.js`
- Modify: `src/pages/Onboarding/OptionGroups.jsx`
- Modify: `src/pages/Onboarding/QuestionScreen.jsx`

**Interfaces:**
- Consumes: Task 1의 `Radio`(이 유형에서는 쓰지 않는다), `motivation` 문항의 `iconSize`·`iconTop` 필드
- Produces: `OptionGroups.jsx`의 `GridOptions({ question, selectedId, onSelect })`

- [ ] **Step 1: 아이콘 6개를 내려받는다**

`mcp__figma__download_assets`를 노드마다 호출한다. `fileKey`는 `aoS5iGGARfUmDknJfwopdT`, `defaultFormat`은 `png`, `defaultScale`은 `2`로 고정한다. 응답의 `export`를 저장한다.

| nodeId | 저장 경로 |
| :--- | :--- |
| `1:2199` | `src/assets/images/onboarding_motivation/moist_skin.png` |
| `1:2203` | `src/assets/images/onboarding_motivation/calm_trouble.png` |
| `1:2206` | `src/assets/images/onboarding_motivation/hydration.png` |
| `1:2209` | `src/assets/images/onboarding_motivation/nutrition.png` |
| `1:2212` | `src/assets/images/onboarding_motivation/home_habit.png` |
| `1:2215` | `src/assets/images/onboarding_motivation/dday.png` |

파일명이 문항 데이터의 옵션 `id`와 같다. 호출이 실패하면 멈추고 NEEDS_CONTEXT로 보고한다.

- [ ] **Step 2: 여섯 파일이 저장됐는지 확인한다**

Run: `ls -la src/assets/images/onboarding_motivation/`
Expected: PNG 6개가 존재하고 크기가 0이 아니다.

- [ ] **Step 3: 문항 데이터에 아이콘을 연결한다**

`src/constants/onboardingQuestions.js` 맨 위에 import 6줄을 추가한다.

```js
import moistSkinIcon from "../assets/images/onboarding_motivation/moist_skin.png";
import calmTroubleIcon from "../assets/images/onboarding_motivation/calm_trouble.png";
import hydrationIcon from "../assets/images/onboarding_motivation/hydration.png";
import nutritionIcon from "../assets/images/onboarding_motivation/nutrition.png";
import homeHabitIcon from "../assets/images/onboarding_motivation/home_habit.png";
import ddayIcon from "../assets/images/onboarding_motivation/dday.png";
```

그리고 `motivation` 문항의 `options` 배열을 아이콘이 포함된 형태로 바꾼다.

```js
        options: [
            { id: "moist_skin", label: "촉촉한 피부", icon: moistSkinIcon, iconSize: 28, iconTop: 21 },
            { id: "calm_trouble", label: "트러블/열감 진정", icon: calmTroubleIcon, iconSize: 33, iconTop: 16 },
            { id: "hydration", label: "수분 챙기기", icon: hydrationIcon, iconSize: 28, iconTop: 29 },
            { id: "nutrition", label: "영양 챙기기", icon: nutritionIcon, iconSize: 40, iconTop: 16 },
            { id: "home_habit", label: "귀가 후 습관 형성", icon: homeHabitIcon, iconSize: 41, iconTop: 14 },
            { id: "dday", label: "D-DAY 약속", icon: ddayIcon, iconSize: 40, iconTop: 18 },
        ],
```

다른 문항은 건드리지 않는다.

- [ ] **Step 4: 그리드형 렌더러를 추가한다**

`src/pages/Onboarding/OptionGroups.jsx`의 `DetailOptions` 아래에 추가한다.

```jsx
export function GridOptions({ question, selectedId, onSelect }) {
    return (
        <div className="absolute left-[16px] top-[264px] w-[358px] grid grid-cols-2 gap-x-[14px] gap-y-[19px]">
            {question.options.map((option) => (
                <button
                    key={option.id}
                    type="button"
                    onClick={() => onSelect(option.id)}
                    className={`relative w-[172px] h-[102px] rounded-[20px] border-2 bg-white cursor-pointer
                        ${selectedId === option.id
                            ? "border-[#65DBBE] shadow-[0px_1px_1px_0px_rgba(101,219,190,0.25)]"
                            : "border-[#F0F0F0] shadow-[0px_1px_1px_0px_rgba(148,148,148,0.25)]"}`}
                >
                    <img
                        src={option.icon}
                        className="absolute left-1/2 -translate-x-1/2"
                        style={{ top: `${option.iconTop}px`, width: `${option.iconSize}px`, height: `${option.iconSize}px` }}
                    />
                    <span className="absolute left-0 top-[56px] w-[172px] text-center
                        text-[16px] font-medium text-[#0F0F0F] tracking-[-0.16px] leading-[28px]">
                        {option.label}
                    </span>
                </button>
            ))}
        </div>
    );
}
```

아이콘은 시안에서 카드마다 좌표가 조금씩 다르지만(left 65~72) 모두 가로 중앙에서 최대 2.5px 이내다. 카드마다 좌표를 박아두는 대신 가로 중앙 정렬하고 세로 위치와 크기만 데이터에서 받는다.

- [ ] **Step 5: 공통 뼈대에서 그리드형을 연결한다**

`src/pages/Onboarding/QuestionScreen.jsx`의 import를 수정한다.

```jsx
import { ListOptions, DetailOptions, GridOptions } from "./OptionGroups";
```

그리고 `DetailOptions` 렌더 블록 아래에 추가한다.

```jsx
            {question.type === "grid" && (
                <GridOptions question={question} selectedId={selectedId} onSelect={onSelect} />
            )}
```

- [ ] **Step 6: 빌드와 린트를 확인한다**

Run: `npm run build`
Expected: PASS

Run: `npm run lint`
Expected: PASS

- [ ] **Step 7: 커밋**

```bash
git add src/assets/images/onboarding_motivation src/constants/onboardingQuestions.js src/pages/Onboarding/OptionGroups.jsx src/pages/Onboarding/QuestionScreen.jsx
git commit -m "✨ Feat : 온보딩 설문 건강관리 계기 문항 구현"
```

- [ ] **Step 8: 사람이 확인할 항목을 보고서에 남긴다**

- 6번 문항(계기)에 카드 6개가 2열 3행으로 뜨고, 각 카드에 아이콘과 라벨이 보인다
- 카드를 누르면 테두리와 그림자가 민트색으로 바뀐다
- 다른 카드를 누르면 이전 선택이 풀린다
- 이 화면은 마스코트와 뒤로가기 화살표가 다른 문항보다 조금 위에 있다

---

### Task 4: 로딩 화면과 설문 완료

마지막 문항에서 "다음으로"를 누르면 답변을 저장하고 로딩 화면을 2초 보여준 뒤 `/home`으로 보낸다.

**Files:**
- Create: `src/pages/Onboarding/OnboardingLoading.jsx`
- Create: `src/assets/images/onboarding_loading/` 아래 이미지 7개
- Modify: `src/pages/Onboarding/Onboarding.jsx`

**Interfaces:**
- Consumes: `useOnboardingStore`의 `completeOnboarding(answers)`
- Produces: `OnboardingLoading.jsx`의 기본 내보내기 `OnboardingLoading()` — props 없음. 자체 타이머로 `/home`으로 이동한다.

- [ ] **Step 1: 로딩 화면 이미지를 내려받는다**

`mcp__figma__download_assets`를 노드마다 호출한다. `fileKey`는 `aoS5iGGARfUmDknJfwopdT`, `defaultFormat`은 `png`, `defaultScale`은 `2`.

| nodeId | 저장 경로 | 시안 크기·위치 |
| :--- | :--- | :--- |
| `1:2233` | `src/assets/images/onboarding_loading/mascot.png` | 96×124, left 144, top 288 |
| `1:2231` | `src/assets/images/onboarding_loading/icon_1.png` | 36×36, left 146, top 204 |
| `1:2232` | `src/assets/images/onboarding_loading/icon_2.png` | 33×33, left 214, top 204 |
| `1:2230` | `src/assets/images/onboarding_loading/icon_3.png` | 32×32, left 97, top 234 |
| `1:2229` | `src/assets/images/onboarding_loading/icon_4.png` | 38×38, left 262, top 234 |
| `1:2228` | `src/assets/images/onboarding_loading/icon_5.png` | 32×32, left 68, top 286 |
| `1:2227` | `src/assets/images/onboarding_loading/icon_6.png` | 34×34, left 289, top 286 |

`1:2233`은 시안에서 잘려 있는 이미지다. `export`로 받으면 잘린 결과가 그대로 나오므로 추가 처리가 필요 없다.

- [ ] **Step 2: 일곱 파일이 저장됐는지 확인한다**

Run: `ls -la src/assets/images/onboarding_loading/`
Expected: PNG 7개가 존재하고 크기가 0이 아니다.

- [ ] **Step 3: 로딩 화면을 만든다**

`src/pages/Onboarding/OnboardingLoading.jsx`를 새로 만든다.

```jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import phone from "../../assets/images/phone.svg";
import loadingMascot from "../../assets/images/onboarding_loading/mascot.png";
import icon1 from "../../assets/images/onboarding_loading/icon_1.png";
import icon2 from "../../assets/images/onboarding_loading/icon_2.png";
import icon3 from "../../assets/images/onboarding_loading/icon_3.png";
import icon4 from "../../assets/images/onboarding_loading/icon_4.png";
import icon5 from "../../assets/images/onboarding_loading/icon_5.png";
import icon6 from "../../assets/images/onboarding_loading/icon_6.png";

// 시안의 좌표를 그대로 옮긴다
const FLOATING_ICONS = [
    { src: icon1, className: "left-[146px] top-[204px] w-[36px] h-[36px]" },
    { src: icon2, className: "left-[214px] top-[204px] w-[33px] h-[33px]" },
    { src: icon3, className: "left-[97px] top-[234px] w-[32px] h-[32px]" },
    { src: icon4, className: "left-[262px] top-[234px] w-[38px] h-[38px]" },
    { src: icon5, className: "left-[68px] top-[286px] w-[32px] h-[32px]" },
    { src: icon6, className: "left-[289px] top-[286px] w-[34px] h-[34px]" },
];

export default function OnboardingLoading() {

    const navigate = useNavigate();

    // 2초 뒤 홈으로 보낸다. 히스토리를 교체해 뒤로가기로 되돌아오지 않게 한다.
    useEffect(() => {
        const timer = setTimeout(() => navigate("/home", { replace: true }), 2000);
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="relative w-[390px] h-[844px]">
            <img src={phone} className="mt-2" />
            {FLOATING_ICONS.map((icon) => (
                <img key={icon.className} src={icon.src} className={`absolute ${icon.className}`} />
            ))}
            <img src={loadingMascot} className="absolute left-[144px] top-[288px] w-[96px] h-[124px]" />
            <p className="absolute left-0 top-[500px] w-[390px] text-center text-[24px] font-semibold text-black">
                오늘의 미션을 준비하고 있어요!
            </p>
            <p className="absolute left-0 top-[544px] w-[390px] text-center text-[18px] font-medium text-black leading-normal">
                고객님의 정보를 확인하고 있습니다.
                <br />
                잠시만 기다려 주세요..
            </p>
        </div>
    );
}
```

시안은 두 문단을 왼쪽 좌표(left 48 / left 69)로 배치하고 둘째 줄 앞에 공백 문자를 넣어 정렬을 맞췄다. 여기서는 폭 390px에 가운데 정렬로 같은 결과를 만든다.

- [ ] **Step 4: 컨트롤러에 완료 처리를 넣는다**

`src/pages/Onboarding/Onboarding.jsx`를 수정한다.

import 두 줄을 추가한다.

```jsx
import useOnboardingStore from "../../store/onboardingStore";
import OnboardingLoading from "./OnboardingLoading";
```

`const isLoggedIn = ...` 다음 줄에 추가한다.

```jsx
    const completeOnboarding = useOnboardingStore((state) => state.completeOnboarding);
```

`handleNext`를 바꾼다.

변경 전:

```jsx
    const handleNext = () => {
        setStep(step + 1);
    };
```

변경 후:

```jsx
    const handleNext = () => {
        // 마지막 문항이면 답변을 저장하고 로딩 화면으로 넘어간다
        if (step === ONBOARDING_QUESTIONS.length - 1) {
            completeOnboarding({ ...answers });
        }
        setStep(step + 1);
    };
```

그리고 `const question = ONBOARDING_QUESTIONS[step];` **바로 다음 줄**에 로딩 화면 분기를 넣는다. `handleSelect` 정의보다 앞이다.

```jsx
    if (step >= ONBOARDING_QUESTIONS.length) {
        return <OnboardingLoading />;
    }
```

**이 위치여야 하는 이유:** 마지막 문항에서 `handleNext`가 `step`을 문항 개수와 같게 만들면 `question`이 `undefined`가 된다. 그 상태로 `QuestionScreen`이 렌더되면 `question.titleTop`을 읽다가 터진다. 이 분기가 그 전에 빠져나간다.

`useEffect`와 `if (!isLoggedIn) return null;`은 이 분기보다 앞에 그대로 둔다. 훅은 모든 조기 반환보다 위에 있어야 호출 순서가 매 렌더 같게 유지된다.

- [ ] **Step 5: 빌드와 린트를 확인한다**

Run: `npm run build`
Expected: PASS

Run: `npm run lint`
Expected: PASS

- [ ] **Step 6: 커밋**

```bash
git add src/assets/images/onboarding_loading src/pages/Onboarding/OnboardingLoading.jsx src/pages/Onboarding/Onboarding.jsx
git commit -m "✨ Feat : 온보딩 설문 로딩 화면 및 완료 처리 구현"
```

- [ ] **Step 7: 사람이 확인할 전체 항목을 보고서에 남긴다**

이 태스크가 끝나면 흐름이 완성되므로 전체 시나리오를 적는다.

- 로그인 → 설문 1번 문항, 하단 탭바 없음
- 6개 문항을 끝까지 진행 → 로딩 화면이 2초 뜬 뒤 `/home`으로 가고 탭바가 복귀한다
- `/home`에서 브라우저 뒤로가기를 눌러도 로딩 화면으로 돌아오지 않는다
- 브라우저 개발자도구 → Application → Local Storage에 `staycare-onboarding` 키가 있고, 답변 6개와 `hasCompletedOnboarding: true`가 들어 있다
- 새로고침 후 다시 로그인하면 **설문을 건너뛰고 바로 `/home`으로 간다**
- Local Storage에서 `staycare-onboarding`을 지우고 다시 로그인하면 설문이 처음부터 나온다

---

## 구현 후 사람에게 확인받을 항목

코드로 판단할 수 없어 남겨두는 것들이다.

**시안의 오타 — 해소됨.** 4번 문항 제목이 "외출하는 횟수**을** 골라주세요"로 되어 있어 시안 그대로 옮겨두었으나, 이후 이 문항이 평균 귀가 시간 문항으로 교체되면서 사라졌다. 새 문항의 제목에도 "귀가**을** 시간을"이라는 오타가 있었는데 이번에는 "귀가 시간을"로 바로잡아 반영했다.

**계기 카드의 장식 타원** — "촉촉한 피부" 카드에만 아이콘 뒤에 타원(`Ellipse 13`)이 깔려 있다. 선택·미선택 프레임 양쪽에 있으므로 선택 표시가 아니다. 여섯 카드 중 하나만 다르게 보이는 것이 의도인지 확인이 필요해 구현에서 제외했다.

**설문 재응시 수단이 없다** — 한 번 마치면 `localStorage`를 직접 지우지 않는 한 설문을 다시 볼 수 없다. 데모 리허설에서 반복해 보여줘야 한다면 마이페이지의 로그아웃 버튼과 함께 초기화 기능을 별도 작업으로 잡는 것이 좋다.
