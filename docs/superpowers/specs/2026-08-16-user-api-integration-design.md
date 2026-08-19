# 사용자(User) API 연동 설계

- 작성일: 2026-08-16
- 대상 API: `https://api.staycare.shop` (Swagger: `/swagger-ui/index.html`, OpenAPI: `/v3/api-docs`)

## 1. 배경

로그인(`POST /api/users/login`)은 이미 연동되어 있다. 그러나 온보딩에서 모은 값은
`src/pages/Onboarding/Onboarding.jsx`의 `completeOnboarding()`에서 `console.log`만 하고
서버로 전송되지 않으며, 마이페이지는 `src/api/mypage.js`의 더미 데이터와
`useOnboardingStore`의 로컬 값으로 화면을 그린다. 포인트도 `usePointStore`에
`2179`로 하드코딩되어 있다.

즉, 사용자 정보가 서버에 저장되지도 조회되지도 않는 상태다.

## 2. 범위

### 연동한다

| API | 용도 |
| --- | --- |
| `POST /api/diagnoses` | 온보딩 완료 시 진단 결과 저장 |
| `GET /api/users/me` | 마이페이지 프로필·포인트 조회 |

### 연동하지 않는다

- `PATCH /api/users/nickname`, `PATCH /api/users/goal`,
  `PATCH·DELETE /api/users/profile-image`, `PATCH /api/users/notification-setting`
  — 대응하는 화면·기능이 없다.
- `GET /api/points/me` — `UserResponse.totalPoint`에 같은 값이 들어 있어 요청이 중복된다.
- `GET /api/diagnoses/options` — 선택지가 `src/constants/onboardingData.js`에
  아이콘·설명과 함께 이미 정의되어 있고, 서버 응답에는 아이콘이 없어 대체할 수 없다.

### 건드리지 않는다

- `src/api/mypage.js`의 스탬프 함수 3개 (`getStamps`, `getStampCalendar`,
  `getStampStartMonth`) — 대응 API가 없어 더미를 유지한다.
- `useOnboardingStore`를 참조하는 Product 계열 화면 — 이번 작업 범위 밖이다.
- 로그인 직후 라우팅 — 지금처럼 항상 `/onboarding`으로 보낸다.

## 3. 서버 스펙

### 인증

OpenAPI 문서에 전역 보안이 걸려 있다.

```json
"security": [{ "bearerAuth": [] }]
"securitySchemes": { "bearerAuth": { "type": "http", "scheme": "bearer", "bearerFormat": "JWT" } }
```

전역이므로 `POST /api/users/login`을 뺀 모든 엔드포인트가 `Authorization: Bearer <accessToken>`를
요구한다. 실측으로 확인했다 — 토큰 없이 `GET /api/users/me`는 401, 토큰을 붙이면 200이다.
프론트는 `src/api/axios.js`의 요청 인터셉터가 이미 토큰을 붙이므로 추가 작업이 없다.
(Swagger UI에서 직접 시험할 때는 우측 상단 `Authorize`에 토큰을 넣어야 401이 나지 않는다.)

### `POST /api/diagnoses` — DiagnosisRequest

전부 필수.

| 필드 | 타입 | 값 |
| --- | --- | --- |
| `gender` | string | `남성` \| `여성` |
| `age` | int | 예: `24` |
| `skinType` | string | `건성` \| `지성` \| `복합성` \| `수부지` \| `중성` |
| `wakeUpTime` | string | 예: `"06:00"` |
| `returnHomeTime` | string | 예: `"18:00"` |
| `checkCycle` | string | `7일` \| `14일` \| `21일` \| `28일` |
| `careMotivation` | string | `촉촉한 피부` \| `D-DAY 약속` \| `트러블/열감 진정` \| `귀가 후 습관 형성` \| `수분 챙기기` \| `영양 챙기기` |

응답 `DiagnosisResponse`: `diagnosisId`, `gender`, `age`, `skinTypeLabel`,
`wakeUpTime`, `returnHomeTime`, `checkCycleDays`, `careMotivationLabel`,
`awardedPoint`, `totalPoint`.

### `GET /api/users/me` — UserResponse

실측 응답 (테스트 계정, `userId: 1`):

```json
{
  "userId": 1,
  "nickname": "test",
  "goal": "123",
  "profileImageUrl": "https://stay-care-s3-....s3.ap-northeast-2.amazonaws.com/profile-images/1/....png",
  "age": 24,
  "gender": "남성",
  "skinType": "건성",
  "wakeUpTime": "06:00:00",
  "returnHomeTime": "18:00:00",
  "checkCycle": "7일",
  "careMotivation": "촉촉한 피부",
  "notificationEnabled": true,
  "totalPoint": 16
}
```

여기서 얻은 사실 세 가지가 아래 설계에 반영되어 있다.

- **`wakeUpTime`·`returnHomeTime`은 `"HH:mm:ss"` 문자열이다.** Swagger 문서는 `LocalTime`을
  객체(`{hour, minute, second, nano}`)로 정의하지만 실제 직렬화는 문자열이다. 실제 응답을 따른다.
- **`goal`에 `"123"`이 들어 있다.** 목표 수정 API를 쓰지 않으므로 서버 값을 신뢰할 수 없다.
  마이페이지 목표 칸은 `careMotivation`을 우선한다.
- **`profileImageUrl`에 실제 이미지가 있다.** 업로드는 연동하지 않지만 표시는 한다.

## 4. 설계

### 4.1 데이터 흐름

```
[온보딩 6단계 입력]
      ↓  useOnboardingStore (로컬 폼 상태)
[RoutineStep "다음"]
      ↓  toDiagnosisRequest()
POST /api/diagnoses
      ↓  (성공)
GET /api/users/me
      ↓
useUserStore.user  ──→  MyPage 프로필
                   └──→  usePointStore.point (totalPoint 동기화)
```

진단 응답(`DiagnosisResponse`)을 직접 화면에 쓰지 않고 `GET /api/users/me`를
한 번 더 호출한다. `DiagnosisResponse`는 `skinTypeLabel`·`careMotivationLabel`·
`checkCycleDays`로 필드명과 타입이 `UserResponse`와 다르고 `nickname`·
`profileImageUrl`·`notificationEnabled`가 없어, 그대로 저장하면 화면이 두 가지
모양을 알아야 한다. 요청 1회를 추가하는 대신 앱 전체가 `UserResponse` 하나만
알도록 한다.

### 4.2 새 파일

#### `src/api/user.js`

```js
getMe()  // GET /api/users/me → UserResponse
```

기존 `src/api/auth.js`의 `getMe()`를 이 파일로 옮긴다. `auth.js`에는 `login()`만
남긴다 (인증과 사용자 정보의 경계를 나눈다). `getMe()`는 현재 어느 화면도
호출하지 않으므로 이동에 따른 영향은 없다.

#### `src/api/diagnosis.js`

```js
createDiagnosis(payload)  // POST /api/diagnoses → DiagnosisResponse
```

#### `src/utils/user.js`

```js
toDiagnosisRequest(onboardingState)  // → DiagnosisRequest
findMissingStep(onboardingState)     // 빠진 값이 있으면 돌아갈 온보딩 페이지 번호, 없으면 null
formatTime(value)                    // "06:00:00" → "06:00"
```

`toDiagnosisRequest` 매핑:

| `useOnboardingStore` | → | `DiagnosisRequest` | 변환 |
| --- | --- | --- | --- |
| `gender` | → | `gender` | 그대로 (`"여성"` / `"남성"`) |
| `age` | → | `age` | 그대로 |
| `skinType` | → | `skinType` | 그대로 |
| `morningTime` | → | `wakeUpTime` | 이름만 변경 |
| `eveningTime` | → | `returnHomeTime` | 이름만 변경 |
| `routine` | → | `checkCycle` | `` `${routine}일` `` |
| `purpose` | → | `careMotivation` | 그대로 |

`InfoStep`은 `gender`를 `"여성"`/`"남성"`으로, `SkinStep`은 `SKINTYPE[].type`
(`"건성"` 등)으로, `PurposeStep`은 `changes[].title`(`"촉촉한 피부"` 등)로 저장하며
모두 서버 enum과 정확히 일치한다. 변환이 필요한 값은 `checkCycle` 하나뿐이다.

`formatTime(value)`: `"06:00:00"` → `"06:00"` (앞 5글자). 값이 없으면 `null`.
현재 마이페이지가 시간을 표시하지 않아 당장 쓰이지는 않지만, 사용자 데이터를
서버 모양 ↔ 화면 모양으로 옮기는 변환 코드를 이 파일 한곳에 모아둔다.

#### `src/store/useUserStore.js`

```js
{
  user: null,            // UserResponse 통째로
  status: "idle",        // "idle" | "loading" | "error"

  fetchUser(),           // GET me → user 저장, totalPoint 를 usePointStore 로 동기화
  setUser(user),
  clear(),
}
```

`persist`를 쓰지 않는다. 서버가 진실이고, 새로고침 시 화면이 다시 조회하면 된다.
localStorage에 남겨두면 다른 계정으로 로그인했을 때 이전 사용자 정보가 잠깐
보이는 문제가 생긴다.

`fetchUser()`는 동시 호출을 막기 위해 `status === "loading"`이면 즉시 반환한다.

토큰이 사라지면(로그아웃·401) 사용자 정보도 비워야 한다. 이때 `src/api/axios.js`의
401 인터셉터가 `useUserStore.clear()`를 직접 부르면
`axios → useUserStore → api/user → axios`로 모듈이 서로를 import하게 된다.
대신 `useUserStore`가 `useAuthStore`의 토큰 변화를 구독한다. `useAuthStore`는
어떤 API 모듈도 import하지 않으므로 순환이 생기지 않고, `axios.js`는 그대로 둔다.

```js
useAuthStore.subscribe((state, prevState) => {
  if (prevState.accessToken && !state.accessToken) {
    useUserStore.getState().clear();
  }
});
```

### 4.3 기존 파일 변경

#### `src/pages/Onboarding/Onboarding.jsx`

`completeOnboarding()`을 async로 바꾼다.

```
1. 필수값 검증 (gender / skinType / purpose 가 빈 문자열이면 해당 스텝으로 이동)
2. setPage(7)  → Loading 화면 표시
3. await Promise.all([ createDiagnosis(payload), wait(2000) ])
4. await fetchUser()
5. setPage(8)  → Result
```

`wait(2000)`은 요청이 빨리 끝나도 로딩 연출이 깜빡이지 않도록 최소 노출 시간을
보장한다.

3번이 실패하면 `setPage(6)`으로 되돌리고 에러 메시지 상태를 세운다.
4번(`fetchUser`)만 실패한 경우 진단 저장은 이미 성공했으므로 되돌리지 않고
`setPage(8)`로 진행한다 (마이페이지에서 다시 조회한다).

중복 제출을 막기 위해 `isSubmitting` 상태를 두고 `RoutineStep`의 버튼을 비활성화한다.

#### `src/pages/Onboarding/Loading.jsx`

5초 후 `onNext()`를 호출하는 `useEffect`와 `onNext` prop을 제거한다. 진행은 부모가
제어한다. 아이콘 애니메이션 `useEffect`는 그대로 둔다.

#### `src/pages/Onboarding/steps/RoutineStep.jsx`

`onNext`가 async가 되므로 `disabled` prop과 에러 문구 표시를 받는다.
`OnboardingButton`이 `disabled`를 지원하는지 확인하고, 없으면 추가한다.

#### `src/pages/MyPage/MyPage.jsx`

- 마운트 시 `user`가 없으면 `fetchUser()` 호출
- `getMyProfile()` 대신 `toProfile(user, fallback)` 사용
- `status === "loading"`이고 `user`가 없으면 기존 레이아웃에 값만 비운 상태로 표시
  (스켈레톤을 새로 만들지 않는다)

#### `src/api/mypage.js`

`getMyProfile()`을 제거하고 순수 변환 함수 `toProfile(user, fallback)`을 둔다.
`fallback`은 `useOnboardingStore`의 값이다.

| 프로필 필드 | 값 |
| --- | --- |
| `nickname` | `fallback.nickname` → `user.nickname` → `"수분남"` |
| `age` | `user.age` → `fallback.age` → `24` |
| `skinTypeLabel` | `` `${user.skinType ?? fallback.skinType ?? "지성"}피부` `` |
| `goal` | `user.careMotivation` → `fallback.purpose` → `user.goal` → `"촉촉한 피부"` |
| `profileImageUrl` | `user.profileImageUrl` → `null` |
| `progressDay` | `3` (더미 유지 — 대응 API 없음) |

닉네임만 로컬 값을 우선하는 이유: 닉네임 수정 API를 연동하지 않으므로
`NicknameEdit` 화면은 `useOnboardingStore`에만 저장한다. 서버 값을 우선하면
사용자가 닉네임을 바꿔도 화면이 그대로여서 고장난 것처럼 보인다.

`goal`에서 `user.goal`을 마지막에 두는 이유: 목표 수정 API를 쓰지 않아 서버 값이
관리되지 않으며, 실제로 테스트 계정에 `"123"`이 들어 있다. 온보딩에서 고른
`careMotivation`이 사용자가 의도한 값이다.

스탬프 함수 3개는 그대로 둔다.

#### `src/components/mypage/ProfileCard.jsx`

`profile.profileImageUrl`이 있으면 그 이미지를, 없으면 기존
`profile_default.png`를 쓴다. 업로드·삭제 UI는 만들지 않는다.

#### `src/store/usePointStore.js`

`setPoint(value)`를 추가한다. `useUserStore.fetchUser()` 성공 시
`user.totalPoint`로 동기화한다. `INITIAL_POINT = 2179`는 서버 값이 오기 전
초기값으로 남기고, `totalPoint`가 숫자로 오면 덮어쓴다 (`null`이면 유지).

실측 `totalPoint`가 `16`이므로, 연동 후 제품 화면의 "포인트 사용시" 금액이
크게 달라진다. 의도된 변화다.

## 5. 에러 처리

| 상황 | 동작 |
| --- | --- |
| 401 | 기존 인터셉터 — `logout()` + `useUserStore.clear()` + `/` 이동 |
| 진단 실패 | `RoutineStep`으로 복귀, `"잠시 후 다시 시도해주세요"` 표시 |
| 진단 성공 후 me 실패 | `Result`로 계속 진행. 마이페이지에서 재조회 |
| 마이페이지 me 실패 | `useOnboardingStore` 값으로 폴백해 화면을 채운다 (데모 중 화면이 깨지지 않게) |
| 필수값 미선택 | 요청하지 않고 해당 스텝으로 이동 |

## 6. 검증

이 프로젝트에는 테스트 러너가 없다 (`package.json`에 `test` 스크립트 없음).
이번 작업 규모에 비해 러너를 새로 세팅하는 것은 과하므로 수동으로 검증한다.

1. `npm run dev` 후 로그인 → 온보딩 6단계를 모두 입력
2. 네트워크 탭에서 `POST /api/diagnoses`가 200이고, 요청 본문의 `checkCycle`이
   `"7일"` 형태의 문자열인지 확인
3. 이어서 `GET /api/users/me`가 200이고 응답에 방금 입력한 값이 담겨 오는지 확인
4. 마이페이지에서 나이·피부타입이 서버 응답과 일치하고, 목표 칸에 온보딩에서 고른
   값이 뜨는지 확인 (`"123"`이 뜨면 실패)
5. 프로필 이미지가 S3 이미지로 뜨는지 확인
6. 포인트 카드 숫자가 `totalPoint`와 같은지 확인 (더 이상 2179가 아님)
7. 새로고침 후 마이페이지가 다시 조회해 같은 값을 보여주는지 확인
8. 닉네임 수정 후 마이페이지에 반영되는지 확인 (로컬 저장이므로 반영되어야 함)
9. DevTools에서 오프라인으로 전환하고 온보딩을 완료해 `RoutineStep` 복귀와
   에러 문구를 확인
10. localStorage의 `auth-storage`를 지우고 마이페이지에 진입해 `/`로 튕기는지 확인

## 7. 남는 것

- 테스트 계정이 `userId: 1` 하나뿐이라 팀원이 온보딩을 완료할 때마다 서버의
  진단 값이 덮어써진다. 회원가입 API가 생기기 전까지는 그대로 간다.
- 스탬프 데이터는 더미로 남는다. 서버에 스탬프/코스 API가 생기면
  `src/api/mypage.js`의 나머지 세 함수를 교체한다.
- 닉네임은 서버에 저장되지 않는다. `PATCH /api/users/nickname`을 연동하면
  `toProfile`의 닉네임 우선순위를 서버 값 우선으로 되돌린다.
- `progressDay`(N일째 진행중)는 대응 API가 없어 `3`으로 고정된다.
- 프로필 이미지 업로드·알림 설정·목표 수정은 화면이 생길 때 연동한다.
