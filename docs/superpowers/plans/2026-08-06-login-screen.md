# 로그인 화면 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 진입 경로 `/`에 로그인 화면을 만들고, 프론트엔드에 고정한 테스트 계정과 대조해 성공 시 `/home`으로 이동시킨다.

**Architecture:** 기존 빈 `src/pages/Main/Main.jsx`를 로그인 화면으로 채운다. 상단 장식 영역은 Figma 프레임 전체를 PNG 한 장으로 내보내 CSS로 잘라 쓰고, 하단 폼만 실제 요소로 만든다. 로그인 상태는 zustand 스토어에 메모리로만 보관하며, 테스트 계정은 교체 지점을 명확히 하려고 별도 상수 파일에 둔다.

**Tech Stack:** React 19, react-router-dom 7, zustand 5, Tailwind CSS 4, Vite 8

**Spec:** [docs/superpowers/specs/2026-08-06-login-screen-design.md](../specs/2026-08-06-login-screen-design.md)

## Global Constraints

- 언어는 JavaScript(JSX). TypeScript를 설치하거나 `.tsx` 파일을 만들지 않는다.
- 스타일은 Tailwind CSS 유틸리티 클래스만 사용한다. `styled-components`나 별도 CSS 파일을 만들지 않는다.
- 수치는 기존 페이지들과 같이 임의값 표기(`w-[360px]`)를 쓴다. `w-90` 같은 캐논컬 변환을 하지 않는다.
- `src/App.jsx`에 라우트를 추가·삭제·재배치하지 않는다. `/`가 가리키는 컴포넌트를 `Home`에서 `Main`으로 바꾸는 것은 이 기능이 요구하는 변경이며 예외다 (Task 1에서 처리).
- 새 npm 패키지를 설치하지 않는다.
- 들여쓰기는 공백 4칸. 기존 파일들과 동일하게 맞춘다.
- 폰트는 `src/index.css`에서 이미 전역 적용돼 있다. `body`에 `Pretendard Variable`이 걸려 있고 로고용 `Rammetto One`은 `.logo-font` 클래스로 정의돼 있다. 컴포넌트에서 `font-['Pretendard_Variable']` 같은 클래스를 따로 붙이지 않는다.
- 커밋 메시지는 README의 컨벤션을 따른다 (`✨ Feat : `, `🔧 Settings : ` 등).

### 시안에서 확정된 값

| 항목 | 값 |
| :--- | :--- |
| 입력 필드 | `w-[360px] h-[60px]`, 흰 배경, `border` 1px `#C3C3C3`, `rounded-[28px]` |
| 입력 placeholder | 14px, Medium, `#A8A8A8`, 좌측 여백 15px |
| 로그인 버튼 | `w-[360px] h-[60px]`, 배경 `#63D7BB`, `rounded-[28px]` |
| 버튼 텍스트 | 20px, Medium, 흰색, 가운데 정렬 |
| 요소 간 간격 | 11px (입력1 y560~620, 입력2 y631~691, 버튼 y702~762) |
| 상단 장식 영역 높이 | 550px |

버튼 민트색은 시안 값 `#63D7BB`를 쓴다. 기존 페이지들이 쓰는 `#65DBBE`와 미묘하게 다르지만, 스펙에서 "시안 값이 다르면 시안을 따른다"로 정했다.

### 테스트 방식에 대한 참고

이 프로젝트에는 테스트 프레임워크가 설치돼 있지 않고, 스펙에서 도입하지 않기로 결정했다. 따라서 각 태스크의 검증은 **`npm run build` · `npm run lint` · 브라우저 수동 확인**으로 대체한다. 자동화된 단위 테스트를 작성하는 단계는 없다.

---

### Task 1: 빌드 복구

현재 `npm run build`가 실패한다. 이후 모든 작업의 검증이 빌드에 의존하므로 먼저 고친다.

**Files:**
- Modify: `src/App.jsx:2`

**Interfaces:**
- Consumes: 없음
- Produces: `src/pages/Main/Main.jsx`의 기본 내보내기가 `/` 경로에 연결된 상태. 이후 태스크는 이 파일을 채운다.

- [ ] **Step 1: 실패를 먼저 확인한다**

Run: `npm run build`

Expected: FAIL. 다음 메시지가 나온다.

```
import Main from "./pages/Main";
                 ─────┬─────
                      ╰── Module not found.
```

- [ ] **Step 2: import 경로를 고친다**

`src/App.jsx`의 2번째 줄을 바꾼다.

변경 전:

```jsx
import Main from "./pages/Main";
```

변경 후:

```jsx
import Main from "./pages/Main/Main";
```

이 줄 외에는 아무것도 건드리지 않는다. `<Route>` 구성은 그대로 둔다.

- [ ] **Step 3: 빌드가 통과하는지 확인한다**

Run: `npm run build`

Expected: PASS. `dist/` 디렉터리가 생성되고 에러 없이 종료된다.

빌드가 다른 이유로 여전히 실패하면 멈추고 에러 내용을 보고한다. 이 계획은 위 `Module not found` 하나만 확인된 상태에서 작성됐다.

- [ ] **Step 4: 커밋**

```bash
git add src/App.jsx
git commit -m "🐛 Fix : Main 페이지 import 경로 수정"
```

---

### Task 2: 로그인 화면 정적 레이아웃

시안과 동일한 화면을 그린다. 이 태스크에서는 동작을 넣지 않는다. 입력은 값을 받기만 하고, 버튼은 눌러도 아무 일이 일어나지 않는다.

**Files:**
- Create: `src/assets/images/login_visual.png`
- Modify: `src/pages/Main/Main.jsx` (전체 교체)
- Modify: `src/layout/RootLayout.jsx`

**Interfaces:**
- Consumes: Task 1이 고친 `/` → `Main` 연결
- Produces: `Main.jsx` 안에 로컬 컴포넌트 `LoginInput({ type, placeholder })`. Task 3에서 `value`, `onChange` 두 prop을 추가한다.

- [ ] **Step 1: 상단 장식 이미지를 내려받는다**

Figma MCP의 `download_assets`를 다음 인자로 호출한다.

- `fileKey`: `ePT8aZw07S36LCpkxqb1Md`
- `nodeId`: `449:2095`
- `defaultFormat`: `png`
- `defaultScale`: `2`

응답의 `export` 항목이 프레임 전체를 합성한 780×1688 PNG다. 이것을 `src/assets/images/login_visual.png`로 저장한다. `rawImages`나 `svgAssets`는 사용하지 않는다 — 장식 요소를 낱개로 배치하지 않기 때문이다.

에셋 URL은 수명이 짧으므로 받은 즉시 저장한다.

- [ ] **Step 2: 파일이 저장됐는지 확인한다**

Run: `ls -la src/assets/images/login_visual.png`

Expected: 파일이 존재하고 크기가 0이 아니다.

- [ ] **Step 3: Footer를 로그인 화면에서 숨긴다**

`src/layout/RootLayout.jsx`를 아래 내용으로 바꾼다.

```jsx
import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";

import Footer from "../components/footer/Footer";

// 하단 탭바를 숨길 경로 목록
const HIDE_FOOTER = ["/", "/register"];

export default function RootLayout() {

    const { pathname } = useLocation();

    return (
        <div className="w-full h-screen overflow-hidden bg-gray-100 flex justify-center">
            <div className="relative w-[390px] h-screen bg-white shadow-lg overflow-hidden">
                <main className="h-full overflow-y-auto pb-20">
                    <Outlet />
                </main>
                {!HIDE_FOOTER.includes(pathname) && <Footer />}
            </div>
        </div>
    );
}
```

`main`의 `pb-20`은 그대로 둔다. Footer를 숨겨도 남는 80px 여백이 시안의 하단 여백 82px과 거의 일치한다.

- [ ] **Step 4: 로그인 화면 마크업을 작성한다**

`src/pages/Main/Main.jsx`를 아래 내용으로 바꾼다.

```jsx
import loginVisual from "../../assets/images/login_visual.png";

function LoginInput({ type, placeholder }) {
    return (
        <input
            type={type}
            placeholder={placeholder}
            className="w-[360px] h-[60px] bg-white border border-[#C3C3C3] rounded-[28px] px-[15px] outline-none
                text-[14px] font-medium text-stone-950 placeholder:text-[#A8A8A8]"
        />
    );
}

export default function Main() {
    return (
        <div>
            {/* 상단 장식 영역 : 프레임 전체 이미지를 550px 지점에서 잘라 노출 */}
            <div className="w-[390px] h-[550px] overflow-hidden">
                <img src={loginVisual} alt="" className="w-[390px]" />
            </div>
            {/* 로그인 폼 */}
            <form className="flex flex-col items-center gap-[11px] mt-[10px]">
                <LoginInput type="text" placeholder="아이디" />
                <LoginInput type="password" placeholder="비밀번호" />
                <button type="submit" className="w-[360px] h-[60px] bg-[#63D7BB] rounded-[28px] cursor-pointer
                    text-white text-[20px] font-medium">
                    로그인하기
                </button>
            </form>
        </div>
    );
}
```

`mt-[10px]`는 장식 영역이 끝나는 550px과 첫 입력이 시작하는 560px의 차이다. `gap-[11px]`은 입력1이 끝나는 620px과 입력2가 시작하는 631px의 차이이며, 입력2와 버튼 사이도 같은 11px이다.

- [ ] **Step 5: 빌드와 린트를 확인한다**

Run: `npm run build`
Expected: PASS

Run: `npm run lint`
Expected: PASS. 에러 없이 종료된다.

- [ ] **Step 6: 브라우저에서 눈으로 확인한다**

Run: `npm run dev`

브라우저에서 `http://localhost:5173/`을 연다. 다음을 모두 확인한다.

- 상단에 민트 배경, `stay care` 로고, 말풍선, 마스코트가 시안대로 보인다
- 장식 영역과 입력 필드 사이에 색이 끊기는 가로 이음새가 보이지 않는다
- 입력 필드 2개와 로그인 버튼이 세로로 나란히 있고 좌우 여백이 같다
- **하단 탭바(Footer)가 보이지 않는다**
- 비밀번호 칸에 글자를 넣으면 점으로 가려진다

이음새가 보이면 `h-[550px]`을 545~555 범위에서 조정해 맞춘다. 조정했다면 `mt-[10px]`도 같은 만큼 반대로 바꿔 첫 입력이 y560에 오도록 유지한다.

확인이 끝나면 `Ctrl+C`로 dev 서버를 종료한다.

- [ ] **Step 7: `/home`에서 Footer가 여전히 보이는지 확인한다**

`npm run dev` 상태에서 `http://localhost:5173/home`을 연다.

Expected: 하단 탭바가 정상적으로 보인다. `HIDE_FOOTER` 변경이 다른 페이지를 망가뜨리지 않았음을 확인하는 단계다.

- [ ] **Step 8: 커밋**

```bash
git add src/assets/images/login_visual.png src/pages/Main/Main.jsx src/layout/RootLayout.jsx
git commit -m "✨ Feat : 로그인 화면 레이아웃 구현"
```

---

### Task 3: 로그인 동작

입력값을 상태로 관리하고, 테스트 계정과 대조해 성공 시 `/home`으로 이동시킨다. 실패하면 버튼 아래에 메시지를 띄운다.

**Files:**
- Create: `src/constants/auth.js`
- Create: `src/store/authStore.js`
- Modify: `src/pages/Main/Main.jsx` (전체 교체)

**Interfaces:**
- Consumes: Task 2가 만든 `Main.jsx`의 `LoginInput` 컴포넌트와 레이아웃
- Produces:
  - `TEST_ACCOUNT` — `{ id: string, password: string }`, `src/constants/auth.js`의 이름 있는 내보내기
  - `useAuthStore` — zustand 훅, `src/store/authStore.js`의 기본 내보내기. 상태는 `isLoggedIn: boolean`, `userId: string | null`, 액션은 `login(userId: string): void`

- [ ] **Step 1: 테스트 계정 상수를 만든다**

`src/constants/auth.js`를 새로 만든다.

```js
// 백엔드에서 테스트 계정을 전달받으면 아래 두 값을 교체한다.
export const TEST_ACCOUNT = {
    id: "test",
    password: "1234",
};
```

`test` / `1234`는 백엔드 전달 전까지 쓰는 임시 값이다.

- [ ] **Step 2: 로그인 상태 스토어를 만든다**

`src/store/authStore.js`를 새로 만든다.

```js
import { create } from "zustand";

const useAuthStore = create((set) => ({
    isLoggedIn: false,
    userId: null,
    login: (userId) => set({ isLoggedIn: true, userId }),
}));

export default useAuthStore;
```

`logout`은 이번 범위에서 호출하는 곳이 없으므로 넣지 않는다.

- [ ] **Step 3: 로그인 화면에 동작을 붙인다**

`src/pages/Main/Main.jsx`를 아래 내용으로 바꾼다. Task 2의 마크업에 상태와 제출 처리가 더해진 최종 형태다.

```jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import loginVisual from "../../assets/images/login_visual.png";
import { TEST_ACCOUNT } from "../../constants/auth";
import useAuthStore from "../../store/authStore";

function LoginInput({ type, placeholder, value, onChange }) {
    return (
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="w-[360px] h-[60px] bg-white border border-[#C3C3C3] rounded-[28px] px-[15px] outline-none
                text-[14px] font-medium text-stone-950 placeholder:text-[#A8A8A8]"
        />
    );
}

export default function Main() {

    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);

    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        // 빈 값으로 제출한 경우도 불일치와 같은 메시지로 처리한다
        if (id !== TEST_ACCOUNT.id || password !== TEST_ACCOUNT.password) {
            setError("아이디 또는 비밀번호가 일치하지 않습니다.");
            return;
        }

        setError("");
        login(id);
        navigate("/home");
    };

    return (
        <div>
            {/* 상단 장식 영역 : 프레임 전체 이미지를 550px 지점에서 잘라 노출 */}
            <div className="w-[390px] h-[550px] overflow-hidden">
                <img src={loginVisual} alt="" className="w-[390px]" />
            </div>
            {/* 로그인 폼 */}
            <form className="flex flex-col items-center gap-[11px] mt-[10px]" onSubmit={handleSubmit}>
                <LoginInput type="text" placeholder="아이디" value={id} onChange={(e) => setId(e.target.value)} />
                <LoginInput type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit" className="w-[360px] h-[60px] bg-[#63D7BB] rounded-[28px] cursor-pointer
                    text-white text-[20px] font-medium">
                    로그인하기
                </button>
                {error && <p className="text-[13px] font-normal text-red-500 mt-[4px]">{error}</p>}
            </form>
        </div>
    );
}
```

`<form>`에 `onSubmit`을 걸고 버튼을 `type="submit"`으로 두었으므로 버튼 클릭과 Enter 키가 같은 경로를 탄다. 에러 메시지는 버튼 아래에 붙어서 다른 요소를 밀지 않는다.

Task 2에서 `h-[550px]`이나 `mt-[10px]`을 조정했다면, 그 값을 여기서도 동일하게 반영한다.

- [ ] **Step 4: 빌드와 린트를 확인한다**

Run: `npm run build`
Expected: PASS

Run: `npm run lint`
Expected: PASS

- [ ] **Step 5: 동작을 수동으로 확인한다**

Run: `npm run dev`

`http://localhost:5173/`에서 다음을 순서대로 확인한다.

1. **빈 값 제출** — 아무것도 입력하지 않고 로그인 버튼을 누른다 → 버튼 아래에 `아이디 또는 비밀번호가 일치하지 않습니다.`가 뜨고 화면이 유지된다
2. **틀린 계정** — 아이디 `wrong`, 비밀번호 `wrong` 입력 후 제출 → 같은 메시지가 뜨고 화면이 유지된다
3. **아이디만 맞음** — 아이디 `test`, 비밀번호 `0000` 제출 → 같은 메시지가 뜬다
4. **맞는 계정** — 아이디 `test`, 비밀번호 `1234` 제출 → `/home`으로 이동하고 하단 탭바가 다시 보인다
5. **Enter 키** — 뒤로 돌아와 `/`에서 비밀번호 칸에 커서를 두고 `test` / `1234`를 입력한 뒤 Enter를 누른다 → `/home`으로 이동한다
6. **에러 초기화** — `/`에서 틀린 값으로 에러를 띄운 뒤 맞는 값으로 다시 제출 → 에러가 남지 않고 이동한다

확인이 끝나면 `Ctrl+C`로 dev 서버를 종료한다.

- [ ] **Step 6: 커밋**

```bash
git add src/constants/auth.js src/store/authStore.js src/pages/Main/Main.jsx
git commit -m "✨ Feat : 테스트 계정 로그인 동작 구현"
```

---

## 알려진 한계

구현 후에도 남는 항목이다. 이번 범위 밖이며 스펙에서 제외로 합의됐다.

**빌드 실패 가능성** — Task 1의 검증은 확인된 `Module not found` 하나를 기준으로 한다. 다른 팀원이 작성 중인 미커밋 파일에 문제가 있으면 빌드가 계속 실패할 수 있다. 그 경우 멈추고 보고한다.
