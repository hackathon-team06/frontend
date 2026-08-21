<p align="center"><b>🦁 서경대학교 멋쟁이사자처럼 14기 중앙해커톤 6팀</b></p>

---

# 🏠 Stay:Care

> AI가 사용자의 컨디션과 일정을 분석하여 맞춤형 홈케어 루틴을 제공하는 개인화 홈 웰니스 서비스

## 🔗 Service

### 🚀 배포 사이트
https://hackathon-staycare.netlify.app/

---

## 📖 서비스 소개

**Stay:Care**는 사용자의 컨디션과 일정을 기반으로 맞춤형 홈케어 루틴을 제공하는 **AI 개인화 홈 웰니스 서비스**입니다.

단순히 정해진 시간에 반복적으로 알림을 보내는 기존 웰니스 앱과 달리, **1분 자가 진단, 당일 피부 상태, 날씨 및 개인 캘린더 일정**을 종합적으로 분석하여 지금 가장 필요한 맞춤형 홈케어 미션을 제안합니다.

- **1분 자가 진단**을 통한 사용자의 기본 컨디션 및 피부 타입 분석
- **7일 · 14일 · 21일 · 28일** 기간별 목표 코스를 통한 건강한 루틴 형성
- **날씨 및 개인 일정**을 반영한 맞춤형 모닝 케어 추천
- **당일 피부 상태**를 반영한 맞춤형 나이트 케어 추천
- **스탬프 지도**를 통한 미션 진행 상황 시각화 및 포인트 보상
- 피부 타입과 최근 컨디션을 기반으로 한 **맞춤형 홈케어 제품 추천**

---

## ✨ 주요 기능

| 기능 | 설명 |
| :--- | :--- |
| 🩺 **1분 컨디션 진단** | 나이, 평균 수면 시간, 기본 피부 타입, 야외 활동 시간 등을 기반으로 사용자의 기본 컨디션을 분석합니다. |
| 🎯 **기간별 목표 코스** | 7일, 14일, 21일, 28일 코스를 선택하여 사용자의 목표에 맞는 홈케어 루틴을 제공합니다. |
| ☀️ **맞춤형 모닝 케어** | 날씨와 개인 일정을 반영하여 외출 전 빠르게 실천할 수 있는 맞춤형 모닝 케어를 추천합니다. |
| 🌙 **맞춤형 나이트 케어** | 음주, 야근, 열감, 트러블 등 당일 피부 상태를 반영하여 맞춤형 저녁 케어 루틴을 추천합니다. |
| 🤖 **AI 실시간 미션 재구성** | 사용자의 당일 컨디션과 개인 일정을 종합하여 현재 필요한 홈케어 미션을 실시간으로 재구성합니다. |
| 📅 **캘린더 연동** | Google Calendar와 연동하여 개인 일정을 반영하고, 중요한 일정에 맞춘 홈케어 미션을 제공합니다. |
| 🗺️ **스탬프 지도** | 1일 차부터 목표일까지의 미션 완료 현황을 지도 형태로 시각화하고, 미션 및 코스 완료 시 포인트를 제공합니다. |
| 📝 **일지 및 리포트** | 미션 달성률과 이전 일지 기록 및 내용을 확인할 수 있습니다. |
| 🛍️ **맞춤 제품 추천** | 피부 타입과 최근 피부 상태를 기반으로 사용자에게 필요한 스킨케어 및 웰니스 제품을 추천합니다. |

---

## 🛠 Tech Stack

| 구분 | 기술 | 활용 |
| :--- | :--- | :--- |
| **Frontend** | React 19, JavaScript (ES6+), JSX | 컴포넌트 기반 SPA 개발 |
| **Build Tool** | Vite 8 | 개발 서버 및 프로덕션 빌드 |
| **Routing** | React Router DOM 7 | 페이지 라우팅 및 동적 경로 관리 |
| **State Management** | Zustand 5, Persist Middleware | 인증, 사용자, 온보딩, 미션 및 포인트 상태 관리 |
| **Styling** | Tailwind CSS 4, CSS3 | UI 스타일링, 디자인 토큰 및 애니메이션 |
| **API** | Axios, REST API | 백엔드 통신, Bearer Token 인증 및 공통 인터셉터 처리 |
| **External Service** | Google Calendar OAuth | 사용자 캘린더 연동 |
| **Font** | Pretendard Variable, Google Fonts | 서비스 본문 및 로고 서체 적용 |
| **Code Quality** | ESLint, Prettier | 코드 품질 및 포맷 관리 |
| **Package Manager** | npm | 패키지 및 의존성 관리 |

---

## 📁 Project Structure

```text
frontend/
├── public/                  # 정적 파일 및 SPA 리다이렉트 설정
├── src/
│   ├── api/                 # Axios 인스턴스와 도메인별 API 요청
│   ├── assets/
│   │   ├── fonts/           # 서비스 폰트
│   │   ├── icons/           # 공통 아이콘
│   │   └── images/          # 캐릭터 및 화면 이미지
│   ├── components/
│   │   ├── common/          # 공통 컴포넌트
│   │   ├── footer/          # 하단 내비게이션
│   │   ├── home/            # 홈 및 미션 컴포넌트
│   │   ├── mypage/          # 마이페이지 컴포넌트
│   │   └── product/         # 상품 관련 컴포넌트
│   ├── constants/           # 정적 데이터와 공통 상수
│   ├── layout/              # 공통 페이지 레이아웃
│   ├── pages/               # 라우트별 페이지 컴포넌트
│   ├── store/               # Zustand 전역 상태 관리
│   ├── utils/               # 날짜, 미션, 사용자 유틸리티
│   ├── App.jsx              # 애플리케이션 라우팅
│   ├── index.css            # 전역 스타일 및 디자인 토큰
│   └── main.jsx             # React 애플리케이션 진입점
├── eslint.config.js         # ESLint 설정
├── vite.config.js           # Vite 및 Tailwind CSS 설정
├── package.json             # 프로젝트 스크립트와 의존성
└── README.md                # 프로젝트 문서
```

---

## 🚀 Getting Started

### 1. Repository Clone

```bash
git clone https://github.com/hackathon-team06/frontend.git
cd frontend
```

### 2. Install

```bash
npm install
```

### 3. Environment Variables

프로젝트 루트에 `.env` 파일을 생성하고 필요한 환경변수를 설정합니다.

```env
VITE_API_BASE_URL=API_BASE_URL
```

> `.env` 파일은 Git에 커밋하지 않습니다.

### 4. Development

```bash
npm run dev
```

### 5. Build

```bash
npm run build
```

---

## 👥 팀원

<p>
<img src="https://img.shields.io/badge/PO-조민서-7B61FF?style=for-the-badge">
<img src="https://img.shields.io/badge/Frontend-백윤관·양희창·홍윤지-34A853?style=for-the-badge">
<img src="https://img.shields.io/badge/Backend-남궁강·이정능-4285F4?style=for-the-badge">
</p>

---

## 🎯 Git Convention

- 🎉 **Start** : Start New Project `[:tada:]`
- ✨ **Feat** : 새로운 기능 추가 `[:sparkles:]`
- 🐛 **Fix** : 버그 수정 `[:bug:]`
- 🎨 **Design** : CSS 등 사용자 UI 디자인 변경 `[:art:]`
- ♻️ **Refactor** : 코드 리팩토링 `[:recycle:]`
- 🔧 **Settings** : 설정 파일 수정 `[:wrench:]`
- 🗃️ **Comment** : 필요한 주석 추가 및 변경 `[:card_file_box:]`
- ➕ **Dependency/Plugin** : 라이브러리 추가 `[:heavy_plus_sign:]`
- 📝 **Docs** : 문서 수정 `[:memo:]`
- 🔀 **Merge** : 브랜치 병합 `[:twisted_rightwards_arrows:]`
- 🚀 **Deploy** : 배포 관련 작업 `[:rocket:]`
- 🚚 **Rename** : 파일 및 폴더 이름 수정 `[:truck:]`
- 🔥 **Remove** : 파일 삭제 `[:fire:]`
- ⏪️ **Revert** : 이전 버전으로 롤백 `[:rewind:]`

---

## 🌲 Branch Convention

- `main` : 배포 가능한 브랜치
- `develop` : 개발 브랜치

- `feat/#이슈번호/명칭` : 새로운 기능 개발 브랜치
  - 예시 : `feat/#12/login`

- `fix/#이슈번호/명칭` : 버그 수정 브랜치
  - 예시 : `fix/#12/mission-state`

- `ui/#이슈번호/명칭` : UI 작업 브랜치
  - 예시 : `ui/#12/home`

- `docs/#이슈번호/명칭` : 문서 작성 및 수정 브랜치
  - 예시 : `docs/#12/readme`

- `api/#이슈번호/명칭` : API 연동 작업 브랜치
  - 예시 : `api/#12/home`

- `refactor/#이슈번호/명칭` : 리팩토링 작업 브랜치
  - 예시 : `refactor/#12/component-structure`

---

## 🌊 Git Flow

1. Issue 생성
2. 최신 `develop` 브랜치에서 작업 브랜치 생성
3. 기능 개발 및 커밋 진행
4. `develop` 브랜치로 Pull Request 생성
5. 코드 리뷰 진행
6. 리뷰 완료 후 `develop` 브랜치로 병합
7. 병합 완료 후 작업 브랜치 삭제
