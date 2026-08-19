# 사용자(User) API 연동 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 온보딩 입력값을 `POST /api/diagnoses`로 저장하고, 마이페이지를 `GET /api/users/me` 응답으로 채운다.

**Architecture:** 진단 저장 후 `GET /api/users/me`를 한 번 더 호출해 `useUserStore`에 `UserResponse`를 통째로 담는다. 화면은 이 한 가지 모양만 알면 된다. 포인트는 `UserResponse.totalPoint`를 `usePointStore`로 옮겨 제품 화면까지 같은 값을 쓴다.

**Tech Stack:** React 19, react-router-dom 7, zustand 5, axios 1.19, Vite 8, Tailwind 4

## Global Constraints

- 설계 문서: `docs/superpowers/specs/2026-08-16-user-api-integration-design.md`
- **이 프로젝트에는 테스트 러너가 없다.** `package.json`에 `test` 스크립트가 없고 테스트 파일도 없다. 러너를 새로 세팅하는 것은 이번 작업 규모에 비해 과하므로, 각 태스크의 검증은 **`npm run lint` + 브라우저 수동 확인**으로 한다. 이 계획의 "Verify" 단계는 TDD의 test 단계를 대체하는 것이며, 실행자는 반드시 결과를 눈으로 확인한 뒤 다음 단계로 넘어간다.
- **git 명령은 실행하지 않는다.** 이 저장소의 커밋·푸시·PR은 사용자가 직접 처리한다. 각 태스크 끝의 커밋 단계는 사용자에게 "지금 커밋하시면 됩니다"라고 알리고 제안 메시지를 보여주는 것까지만 한다.
- 커밋 메시지 컨벤션 (README): `✨ Feat:`, `♻️ Refactor:`, `🐛 Fix:` 등 이모지 + 접두사
- 브랜치: `api/#<이슈번호>/user` (`develop`에서 분기)
- 주석은 한국어로, 기존 파일들의 톤(무엇을 왜 하는지 설명하는 서술체)을 따른다
- 서버 enum 값은 한국어 문자열 그대로 쓴다 (`"남성"`, `"건성"`, `"7일"`, `"촉촉한 피부"`)
- API 함수는 기존 패턴대로 `res.data`만 반환한다

## File Structure

| 파일 | 상태 | 책임 |
| --- | --- | --- |
| `src/api/user.js` | 생성 | `GET /api/users/me` |
| `src/api/diagnosis.js` | 생성 | `POST /api/diagnoses` |
| `src/utils/user.js` | 생성 | 온보딩 값 ↔ 서버 값 변환 |
| `src/store/useUserStore.js` | 생성 | 서버 `UserResponse` 보관 + 조회 |
| `src/api/auth.js` | 수정 | `getMe` 제거, `login`만 남김 |
| `src/store/usePointStore.js` | 수정 | `setPoint` 추가 |
| `src/pages/Onboarding/Onboarding.jsx` | 수정 | 진단 저장 흐름 |
| `src/pages/Onboarding/Loading.jsx` | 수정 | 타이머 제거, 표시 전용 |
| `src/pages/Onboarding/steps/RoutineStep.jsx` | 수정 | 제출 중 비활성화 + 에러 문구 |
| `src/components/common/OnboardingButton/OnboardingButton.jsx` | 수정 | `disabled` 지원 |
| `src/api/mypage.js` | 수정 | `getMyProfile` → `toProfile` |
| `src/pages/MyPage/MyPage.jsx` | 수정 | 서버 값으로 프로필 표시 |
| `src/components/mypage/ProfileCard.jsx` | 수정 | 프로필 이미지 표시 |

---

## Task 1: API 계층과 변환 유틸

**Files:**
- Create: `src/api/user.js`
- Create: `src/api/diagnosis.js`
- Create: `src/utils/user.js`
- Modify: `src/api/auth.js` (19-24행 `getMe` 제거)

**Interfaces:**
- Consumes: `src/api/axios.js`의 기본 export `api` (토큰을 자동으로 붙이는 axios 인스턴스)
- Produces:
  - `getMe(): Promise<UserResponse>` — `src/api/user.js`
  - `createDiagnosis(payload): Promise<DiagnosisResponse>` — `src/api/diagnosis.js`
  - `toDiagnosisRequest(onboardingState): DiagnosisRequest` — `src/utils/user.js`
  - `findMissingStep(onboardingState): number | null` — `src/utils/user.js`
  - `formatTime(value: string | null): string | null` — `src/utils/user.js`

- [ ] **Step 1: `src/api/user.js` 생성**

```js
import api from "./axios";

/** 내 정보 조회. 진단으로 저장한 값과 누적 포인트가 함께 옵니다. */
export async function getMe() {
  const res = await api.get("/api/users/me");

  return res.data;
}
```

- [ ] **Step 2: `src/api/auth.js` 에서 `getMe` 제거**

파일 전체를 아래로 바꿉니다. (인증은 `auth.js`, 사용자 정보는 `user.js` 로 나눕니다)

```js
import api from "./axios";

/**
 * 로그인.
 *
 * 회원가입 API 가 없어 정해진 테스트 계정으로만 로그인합니다.
 * 계정 정보는 .env 에 두고 팀원끼리 값을 공유합니다.
 */
export async function login() {
  const res = await api.post("/api/users/login", {
    loginId: import.meta.env.VITE_TEST_LOGIN_ID,
    password: import.meta.env.VITE_TEST_PASSWORD,
  });

  // { accessToken, refreshToken, tokenType, userId }
  return res.data;
}
```

- [ ] **Step 3: `getMe` 를 쓰던 곳이 없는지 확인**

Run: `npx rg "from \"./auth\"|from \"../api/auth\"|from \"../../api/auth\"" src`
Expected: `src/pages/Login/Login.jsx` 한 곳만 나오고, 거기서 `login` 만 import 한다. `getMe` 를 import 하는 파일은 없다.

- [ ] **Step 4: `src/api/diagnosis.js` 생성**

```js
import api from "./axios";

/**
 * 진단 결과 저장.
 *
 * 온보딩에서 모은 값을 서버에 저장합니다. 저장된 값은 이후
 * GET /api/users/me 응답에 담겨 옵니다.
 */
export async function createDiagnosis(payload) {
  const res = await api.post("/api/diagnoses", payload);

  return res.data;
}
```

- [ ] **Step 5: `src/utils/user.js` 생성**

```js
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
```

- [ ] **Step 6: 변환 결과를 눈으로 확인**

Run: `npm run dev` 후 브라우저 콘솔에서 아래를 붙여넣습니다.

```js
const { toDiagnosisRequest, findMissingStep, formatTime } =
  await import("/src/utils/user.js");

console.log(toDiagnosisRequest({
  gender: "남성", age: 24, skinType: "건성",
  morningTime: "06:00", eveningTime: "18:00",
  routine: 7, purpose: "촉촉한 피부",
}));
console.log(findMissingStep({ gender: "", skinType: "건성", purpose: "촉촉한 피부" }));
console.log(findMissingStep({ gender: "남성", skinType: "건성", purpose: "촉촉한 피부" }));
console.log(formatTime("06:00:00"), formatTime(null));
```

Expected:
1. `{gender:"남성", age:24, skinType:"건성", wakeUpTime:"06:00", returnHomeTime:"18:00", checkCycle:"7일", careMotivation:"촉촉한 피부"}` — **`checkCycle` 이 문자열 `"7일"`** 인지가 핵심
2. `1`
3. `null`
4. `"06:00" null`

- [ ] **Step 7: 린트**

Run: `npm run lint`
Expected: 새로 만든 세 파일에 대한 에러 없음

- [ ] **Step 8: 커밋 (사용자가 실행)**

실행자는 커밋하지 않는다. 사용자에게 아래를 안내한다.

> 여기까지 커밋하시면 됩니다.
> ```
> git add src/api/user.js src/api/diagnosis.js src/utils/user.js src/api/auth.js
> git commit -m "✨ Feat: 사용자·진단 API 함수와 변환 유틸 추가"
> ```

---

## Task 2: 사용자 스토어와 포인트 동기화

**Files:**
- Create: `src/store/useUserStore.js`
- Modify: `src/store/usePointStore.js` (`setPoint` 추가)

**Interfaces:**
- Consumes: `getMe()` (Task 1), `useAuthStore` (기존), `usePointStore` (기존)
- Produces:
  - `useUserStore` — `{ user: UserResponse | null, status: "idle" | "loading" | "error", fetchUser(): Promise<UserResponse>, setUser(user), clear() }`
  - `usePointStore.setPoint(point: number)`

- [ ] **Step 1: `usePointStore` 에 `setPoint` 추가**

`src/store/usePointStore.js` 의 `addPoint` 아래에 넣습니다.

```js
      addPoint: (amount) =>
        set((state) => ({ point: state.point + amount })),

      // 서버에서 받은 누적 포인트로 맞춥니다. (useUserStore.fetchUser 가 호출)
      setPoint: (point) => set({ point }),
```

같은 파일 4-5행의 주석도 현실에 맞게 고칩니다.

```js
/** 서버 값이 오기 전에 보여줄 초기 포인트. GET /api/users/me 응답이 오면 덮어씁니다. */
export const INITIAL_POINT = 2179;
```

- [ ] **Step 2: `src/store/useUserStore.js` 생성**

```js
import { create } from "zustand";

import { getMe } from "../api/user";
import useAuthStore from "./useAuthStore";
import usePointStore from "./usePointStore";

/**
 * 서버에서 받은 내 정보(UserResponse).
 *
 * persist 를 쓰지 않습니다. 서버 값이 진실이고, localStorage 에 남겨두면
 * 다른 계정으로 로그인했을 때 이전 사용자 정보가 잠깐 보입니다.
 * 새로고침하면 화면이 다시 조회합니다.
 */
const useUserStore = create((set, get) => ({
  // 데이터
  user: null,
  status: "idle", // "idle" | "loading" | "error"

  // 함수
  setUser: (user) => set({ user, status: "idle" }),

  clear: () => set({ user: null, status: "idle" }),

  fetchUser: async () => {
    // 이미 요청 중이면 중복으로 보내지 않습니다.
    if (get().status === "loading") return get().user;

    set({ status: "loading" });

    try {
      const user = await getMe();

      set({ user, status: "idle" });

      // 포인트는 제품 화면에서도 쓰므로 전용 스토어로 옮겨둡니다.
      if (typeof user.totalPoint === "number") {
        usePointStore.getState().setPoint(user.totalPoint);
      }

      return user;
    } catch (error) {
      set({ status: "error" });

      throw error;
    }
  },
}));

// 토큰이 사라지면(로그아웃 · 401) 사용자 정보도 함께 비웁니다.
// axios 인터셉터가 useUserStore 를 직접 부르면 모듈이 서로를 import 하게 되어
// (axios → useUserStore → api/user → axios) 여기서 토큰 변화를 구독합니다.
useAuthStore.subscribe((state, prevState) => {
  if (prevState.accessToken && !state.accessToken) {
    useUserStore.getState().clear();
  }
});

export default useUserStore;
```

- [ ] **Step 3: 스토어가 실제로 도는지 확인**

Run: `npm run dev` → 브라우저에서 로그인까지 진행한 뒤 콘솔에 붙여넣습니다.

```js
const useUserStore = (await import("/src/store/useUserStore.js")).default;
const usePointStore = (await import("/src/store/usePointStore.js")).default;

await useUserStore.getState().fetchUser();
console.log(useUserStore.getState().user);
console.log("point:", usePointStore.getState().point);
```

Expected:
- `user` 에 `{userId, nickname, goal, profileImageUrl, age, gender, skinType, wakeUpTime, returnHomeTime, checkCycle, careMotivation, notificationEnabled, totalPoint}` 가 담긴다
- `point` 가 `user.totalPoint` 와 같다 (2179 가 아니다)
- 콘솔에 `api is undefined` 류의 에러가 없다 (모듈 순환 확인)

- [ ] **Step 4: 로그아웃 연동 확인**

이어서 같은 콘솔에서:

```js
const useAuthStore = (await import("/src/store/useAuthStore.js")).default;
useAuthStore.getState().logout();
console.log(useUserStore.getState().user);
```

Expected: `null`

- [ ] **Step 5: 린트**

Run: `npm run lint`
Expected: 에러 없음

- [ ] **Step 6: 커밋 (사용자가 실행)**

> ```
> git add src/store/useUserStore.js src/store/usePointStore.js
> git commit -m "✨ Feat: 사용자 정보 스토어 추가 및 포인트 서버 동기화"
> ```

---

## Task 3: 온보딩 완료 시 진단 저장

**Files:**
- Modify: `src/pages/Onboarding/Onboarding.jsx`
- Modify: `src/pages/Onboarding/Loading.jsx` (29-40행: `onNext` prop 과 5초 타이머 제거)
- Modify: `src/pages/Onboarding/steps/RoutineStep.jsx`
- Modify: `src/components/common/OnboardingButton/OnboardingButton.jsx`

**Interfaces:**
- Consumes: `createDiagnosis()` (Task 1), `toDiagnosisRequest()` · `findMissingStep()` (Task 1), `useUserStore.fetchUser()` (Task 2)
- Produces: 없음 (화면 동작)

- [ ] **Step 1: `OnboardingButton` 에 `disabled` 추가**

`src/components/common/OnboardingButton/OnboardingButton.jsx` 전체를 바꿉니다.

```jsx
export default function OnboardingButton({ title, onClick, disabled = false }) {
  return (
    <div className="flex justify-center">
      <button
        onClick={onClick}
        disabled={disabled}
        className={`absolute bottom-[45px] w-[350px] h-13 bg-[#65DBBE] rounded-lg inline-flex justify-center items-center gap-2.5 
    text-white text-xl font-semibold ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
      >
        {title}
      </button>
    </div>
  );
}
```

- [ ] **Step 2: `Loading` 을 표시 전용으로 바꾸기**

`src/pages/Onboarding/Loading.jsx` 에서 `onNext` prop 과 5초 타이머 `useEffect` 를 지웁니다. 아이콘 애니메이션 `useEffect` 는 그대로 둡니다.

```jsx
export default function Loading() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  // 아이콘 애니메이션
  useEffect(() => {
```

즉 29-40행의 다음 부분을 통째로 제거합니다.

```jsx
export default function Loading({ onNext }) {   // ← { onNext } 제거
  ...
  // 5초 후 Result 페이지로 이동                   // ← 이 useEffect 통째로 제거
  useEffect(() => {
    const timer = setTimeout(() => {
      onNext();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onNext]);
```

다음 화면으로 넘기는 일은 부모(`Onboarding.jsx`)가 API 응답을 받은 뒤에 합니다.

- [ ] **Step 3: `RoutineStep` 이 `disabled` 와 에러 문구를 받도록 수정**

`src/pages/Onboarding/steps/RoutineStep.jsx` 의 시그니처와 마지막 버튼 부분만 바꿉니다.

```jsx
export default function RoutineStep({ onNext, onBack, disabled = false, errorMessage = "" }) {
```

`<OnboardingButton title="다음" onClick={onNext}/>` 를 아래로 교체합니다.

```jsx
      {errorMessage && (
        <p className="absolute bottom-[110px] w-full text-center text-[13px] font-medium text-sale">
          {errorMessage}
        </p>
      )}

      <OnboardingButton
        title={disabled ? "저장 중..." : "다음"}
        onClick={onNext}
        disabled={disabled}
      />
```

- [ ] **Step 4: `Onboarding.jsx` 에 진단 저장 흐름 넣기**

파일 상단 import 에 네 줄을 더합니다.

```jsx
import { useState } from "react";
import useOnboardingStore from "../../store/useOnboardingStore";
import useUserStore from "../../store/useUserStore";
import { createDiagnosis } from "../../api/diagnosis";
import { toDiagnosisRequest, findMissingStep } from "../../utils/user";
```

컴포넌트 바깥에 지연 함수를 둡니다.

```jsx
/** 로딩 화면이 깜빡이지 않도록 최소 노출 시간을 보장합니다. */
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
```

`const [page, setPage] = useState(1);` 아래에 상태를 더합니다.

```jsx
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchUser = useUserStore((state) => state.fetchUser);
```

기존 `completeOnboarding`(26-51행)을 통째로 아래로 교체합니다.

```jsx
  // 온보딩 최종 완료. 진단 결과를 서버에 저장하고 내 정보를 받아옵니다.
  const completeOnboarding = async () => {
    if (isSubmitting) return;

    const onboarding = useOnboardingStore.getState();
    const missingStep = findMissingStep(onboarding);

    // 빠뜨린 항목이 있으면 그 단계로 되돌립니다.
    if (missingStep) {
      setPage(missingStep);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setPage(7); // 로딩 화면

    try {
      await Promise.all([
        createDiagnosis(toDiagnosisRequest(onboarding)),
        wait(2000),
      ]);
    } catch {
      setErrorMessage("저장에 실패했어요. 잠시 후 다시 시도해주세요.");
      setPage(6);
      setIsSubmitting(false);
      return;
    }

    // 진단은 이미 저장됐으므로, 내 정보 조회가 실패해도 계속 진행합니다.
    // (마이페이지에서 다시 조회합니다)
    try {
      await fetchUser();
    } catch {
      // 무시합니다.
    }

    setIsSubmitting(false);
    setPage(8);
  };
```

`case 6` 과 `case 7` 을 바꿉니다.

```jsx
    case 6:
      return (
        <RoutineStep
          onNext={completeOnboarding}
          onBack={previousPage}
          disabled={isSubmitting}
          errorMessage={errorMessage}
        />
      );

    case 7:
      return <Loading />;
```

- [ ] **Step 5: 성공 경로 확인**

Run: `npm run dev` → 로그인 → 온보딩 6단계를 모두 입력하고 마지막 "다음"

Expected:
- 버튼이 "저장 중..." 으로 바뀌고 눌리지 않는다
- 로딩 화면이 약 2초 보인 뒤 Result 화면으로 넘어간다
- 네트워크 탭에 `POST /api/diagnoses` → **200**, 요청 본문의 `checkCycle` 이 `"7일"` 같은 문자열
- 이어서 `GET /api/users/me` → **200**
- 콘솔에 `Warning: Received ... onNext` 류의 경고가 없다

- [ ] **Step 6: 실패 경로 확인**

DevTools Network 탭에서 **Offline** 으로 바꾸고 온보딩 마지막 "다음"을 누릅니다.

Expected: 로딩 화면이 잠깐 보인 뒤 `RoutineStep` 으로 돌아오고, 버튼 위에 "저장에 실패했어요. 잠시 후 다시 시도해주세요." 가 뜬다. 버튼은 다시 눌린다.

- [ ] **Step 7: 빠진 값 경로 확인**

브라우저 콘솔에서 목표를 지우고 다시 시도합니다.

```js
const useOnboardingStore = (await import("/src/store/useOnboardingStore.js")).default;
useOnboardingStore.getState().setPurpose("");
```

온보딩을 다시 진행해 마지막 "다음"을 누릅니다.
Expected: 요청을 보내지 않고 목표 선택 화면(5단계)으로 돌아간다.

- [ ] **Step 8: 린트**

Run: `npm run lint`
Expected: 에러 없음

- [ ] **Step 9: 커밋 (사용자가 실행)**

> ```
> git add src/pages/Onboarding src/components/common/OnboardingButton/OnboardingButton.jsx
> git commit -m "✨ Feat: 온보딩 완료 시 진단 결과 저장 API 연동"
> ```

---

## Task 4: 마이페이지를 서버 값으로 채우기

**Files:**
- Modify: `src/api/mypage.js` (75-85행 `getMyProfile` → `toProfile`)
- Modify: `src/pages/MyPage/MyPage.jsx`
- Modify: `src/components/mypage/ProfileCard.jsx`

**Interfaces:**
- Consumes: `useUserStore.user` · `useUserStore.fetchUser()` (Task 2)
- Produces: `toProfile(user, fallback): { nickname, age, skinTypeLabel, goal, profileImageUrl, progressDay }`

- [ ] **Step 1: `mypage.js` 의 `getMyProfile` 을 `toProfile` 로 교체**

`src/api/mypage.js` 75-85행의 `getMyProfile` 을 지우고 아래를 넣습니다. 파일 위쪽 주석 블록(3-14행)의 `getMyProfile()` 줄도 `toProfile()` 로 고칩니다. 스탬프 함수 세 개(`getStamps`, `getStampCalendar`, `getStampStartMonth`)와 `MISSIONS_PER_DAY` 는 그대로 둡니다.

```js
/**
 * 서버 UserResponse 를 프로필 카드가 쓰는 모양으로 바꿉니다.
 *
 * fallback 은 온보딩 스토어 값입니다. 서버 조회가 실패했거나
 * 아직 진단하지 않아 값이 비어 있을 때 대신 씁니다.
 */
export function toProfile(user, fallback = {}) {
  const server = user ?? {};

  return {
    // 닉네임 수정 API 를 연동하지 않아 서버에는 저장되지 않습니다.
    // 로컬에서 바꾼 값을 먼저 보여줘야 수정이 반영된 것처럼 보입니다.
    nickname: fallback.nickname || server.nickname || DEFAULT_NICKNAME,

    age: server.age ?? fallback.age ?? 24,

    // 온보딩은 "지성"처럼 저장하고 화면에는 "지성피부"로 보여줍니다.
    skinTypeLabel: `${server.skinType || fallback.skinType || "지성"}피부`,

    // 목표 수정 API 를 쓰지 않아 server.goal 은 관리되지 않는 값입니다.
    // (테스트 계정에는 "123" 이 들어 있습니다)
    // 온보딩에서 고른 careMotivation 이 사용자가 의도한 값입니다.
    goal:
      server.careMotivation || fallback.purpose || server.goal || "촉촉한 피부",

    profileImageUrl: server.profileImageUrl || null,

    // TODO(백엔드 연동): 코스 경과 일수 API 가 없어 고정값입니다.
    progressDay: 3,
  };
}
```

- [ ] **Step 2: `MyPage.jsx` 를 서버 값 기반으로 수정**

import 와 컴포넌트 앞부분을 바꿉니다.

```jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import useOnboardingStore from "../../store/useOnboardingStore";
import usePointStore from "../../store/usePointStore";
import useUserStore from "../../store/useUserStore";
import { toProfile, getStamps } from "../../api/mypage";

import ProfileCard from "../../components/mypage/ProfileCard";
import PointCard from "../../components/mypage/PointCard";
import StampCard from "../../components/mypage/StampCard";

export default function MyPage() {
  const navigate = useNavigate();

  const user = useUserStore((state) => state.user);
  const fetchUser = useUserStore((state) => state.fetchUser);

  // 서버 조회가 실패했을 때 대신 쓸 값입니다.
  const nickname = useOnboardingStore((state) => state.nickname);
  const age = useOnboardingStore((state) => state.age);
  const skinType = useOnboardingStore((state) => state.skinType);
  const purpose = useOnboardingStore((state) => state.purpose);

  const point = usePointStore((state) => state.point);

  // 온보딩을 거치지 않고 바로 들어온 경우(새로고침 등)에도 채웁니다.
  useEffect(() => {
    if (user) return;

    // 실패해도 아래 fallback 값으로 화면을 그리므로 그냥 넘깁니다.
    fetchUser().catch(() => {});
  }, [user, fetchUser]);

  const profile = toProfile(user, { nickname, age, skinType, purpose });
  const stamps = getStamps();
```

`return` 아래 JSX 는 그대로 둡니다.

- [ ] **Step 3: `ProfileCard` 가 프로필 이미지를 쓰도록 수정**

`src/components/mypage/ProfileCard.jsx` 의 구조 분해와 `<img>` 두 곳만 바꿉니다.

```jsx
export default function ProfileCard({ profile, onEditNickname }) {
  const { nickname, age, skinTypeLabel, goal, progressDay, profileImageUrl } =
    profile;

  return (
    <section className="relative h-[134px] w-[352px] rounded-[15px] border border-[#dbe7e8] bg-white shadow-[0px_-1px_5px_0px_rgba(101,219,190,0.3)]">
      <img
        src={profileImageUrl || profileDefault}
        alt=""
        className="absolute left-[18px] top-[23px] size-[45px] rounded-full object-cover"
      />
```

나머지는 그대로 둡니다. 업로드·삭제 UI 는 만들지 않습니다.

- [ ] **Step 4: 화면 확인**

Run: `npm run dev` → 로그인 → 온보딩 완료 → 마이페이지

Expected:
- 나이·피부타입이 `GET /api/users/me` 응답과 같다
- 목표 칸에 온보딩에서 고른 값이 뜬다 (**`"123"` 이 뜨면 실패**)
- 프로필 사진이 기본 이미지가 아니라 S3 이미지로 뜬다
- 포인트 카드 숫자가 `totalPoint` 와 같다 (**2179 가 아니다**)

- [ ] **Step 5: 새로고침 확인**

마이페이지에서 F5.
Expected: `GET /api/users/me` 가 한 번 더 나가고 같은 값이 그대로 보인다. (`useUserStore` 는 persist 를 쓰지 않으므로 매번 조회하는 것이 정상)

- [ ] **Step 6: 닉네임 수정 확인**

마이페이지 → 연필 아이콘 → 닉네임 입력 → 확인
Expected: 마이페이지에 바꾼 닉네임이 보인다. (서버 `nickname` 인 `"test"` 로 되돌아가면 실패)

- [ ] **Step 7: 조회 실패 폴백 확인**

DevTools 를 **Offline** 으로 바꾸고 마이페이지를 새로고침합니다.
Expected: 화면이 깨지지 않고, 온보딩에서 입력한 값으로 프로필이 채워진다. 프로필 사진은 기본 이미지.

- [ ] **Step 8: 린트**

Run: `npm run lint`
Expected: 에러 없음

- [ ] **Step 9: 커밋 (사용자가 실행)**

> ```
> git add src/api/mypage.js src/pages/MyPage/MyPage.jsx src/components/mypage/ProfileCard.jsx
> git commit -m "✨ Feat: 마이페이지 내 정보 조회 API 연동"
> ```

---

## Task 5: 전체 흐름 최종 점검

**Files:** 없음 (검증만)

**Interfaces:**
- Consumes: Task 1-4의 결과 전부
- Produces: 없음

- [ ] **Step 1: 저장소를 깨끗한 상태에서 처음부터 확인**

브라우저 DevTools → Application → Local Storage 에서 `auth-storage`, `onboarding-storage`, `point-storage` 를 모두 삭제하고 새로고침합니다.

- [ ] **Step 2: 로그인 → 온보딩 → 마이페이지 전 구간 통과**

Expected 순서대로:
1. 로그인 성공 → `/onboarding`
2. 6단계 입력 후 "다음" → 로딩 약 2초 → Result
3. 루틴 하나 이상 선택 → "시작하기" → Complete → `/home`
4. 하단 탭에서 마이페이지 진입 → 프로필·포인트가 서버 값과 일치

- [ ] **Step 3: 네트워크 요청이 예상대로만 나가는지 확인**

DevTools Network 탭을 `api.staycare.shop` 로 필터합니다.
Expected: `POST /api/users/login` 1회, `POST /api/diagnoses` 1회, `GET /api/users/me` 1회.
`GET /api/points/me` 나 `GET /api/diagnoses/options` 는 나가지 않는다. `GET /api/users/me` 가 여러 번 연달아 나가면 `fetchUser` 의 중복 방지가 안 되는 것이므로 Task 2 를 다시 본다.

- [ ] **Step 4: 401 처리 확인**

Local Storage 의 `auth-storage` 에서 `accessToken` 값을 아무 문자열로 바꾸고 마이페이지를 새로고침합니다.
Expected: `GET /api/users/me` 가 401 → 로그인 화면(`/`)으로 튕긴다.

- [ ] **Step 5: 제품 화면에 포인트가 반영됐는지 확인**

`/product` 으로 이동해 아무 상품이나 열어봅니다.
Expected: "포인트 사용시" 계산에 쓰이는 포인트가 서버 `totalPoint` 기준이다 (2179 가 아니다).

- [ ] **Step 6: 빌드 확인**

Run: `npm run build`
Expected: 에러 없이 완료

- [ ] **Step 7: 최종 커밋과 PR (사용자가 실행)**

> 여기까지 확인되면 `develop` 으로 PR 을 올리시면 됩니다.
> PR 제목 예시: `✨ Feat: 사용자 정보 API 연동 (진단 저장 / 내 정보 조회)`

---

## 이 계획이 다루지 않는 것

설계 문서 §2·§7 과 같습니다. 실행 중에 아래를 발견해도 범위 밖이므로 건드리지 않습니다.

- 닉네임·목표·프로필 이미지·알림 설정 수정 API (대응 화면 없음)
- `GET /api/points/me` (`totalPoint` 와 중복)
- 스탬프 관련 더미 데이터 (대응 API 없음)
- `progressDay` (대응 API 없음, `3` 고정)
- 로그인 후 라우팅 분기 (항상 `/onboarding` 유지)
- `useOnboardingStore` 를 참조하는 Product 계열 화면
