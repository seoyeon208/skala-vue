# SKALA Vue — 날씨 정보 서비스
- 배포: https://skala-vue-lake-tau.vercel.app/
- 저장소: https://github.com/seoyeon208/skala-vue

## 기술 스택

- Vue 3 (Composition API, `<script setup>`)
- Vite
- Vue Router
- Pinia
- Axios
- PrimeVue
- OpenWeatherMap API (현재 날씨 · 예보 · 대기질)
- Wikipedia REST API (도시 소개)
- Leaflet + OpenStreetMap (지도)
- Vercel (배포)

## 실행 방법

```sh
npm install
```

루트에 `.env` 파일을 만들고 OpenWeatherMap API 키를 넣어야 실제 날씨 데이터가 표시된다.

```
VITE_OPENWEATHER_API_KEY=발급받은_키
```

```sh
npm run dev      # 개발 서버
npm run build    # 프로덕션 빌드 (dist/)
npm run lint     # ESLint + oxlint
npm run format   # Prettier
```

## 폴더 구조

```
src/
├── views/              # 라우트 단위 화면
├── components/
│   ├── exercise/       # 날씨 서비스에서 실제로 쓰는 재사용 컴포넌트
│   └── practices/      # 1~4일차 실습 코드 원본 (Code Challenge에서 렌더링)
├── stores/              # Pinia 스토어
├── services/            # 외부 API 호출 함수
├── router/
└── data/                # 도시 목록 mock 데이터 (API 실패 시 fallback)
```

## 개발 기록

### 1일차 — Modern JavaScript / Getting Started with Vue.js / Vue Syntax

ES6+ 문법 복습으로 시작해서 Vite로 프로젝트를 세팅하고, `v-bind`, `v-for`, `v-if`, `v-show`, `v-on`, `v-model`과 그 수식어들을 각각 별도 컴포넌트로 하나씩 연습했다. `v-html`을 배우면서 XSS 위험성도 같이 실습해봤는데, 사용자가 입력한 값을 그대로 `v-html`에 꽂으면 스크립트가 실행될 수 있다는 걸 직접 눈으로 확인하고 나니 왜 `v-text`가 기본값이어야 하는지 체감이 됐다.

### 2일차 — Composition API / Vue Components

`ref`/`reactive`, `computed`, `watch`/`watchEffect`로 반응형 상태를 다루는 법을 연습하고, 이어서 `props`/`emits`, 세 가지 슬롯(default/named/scoped), 생명주기 훅까지 컴포넌트 단위로 익혔다. 배운 걸 바로 써먹으려고 날씨 카드, 검색창, 대시보드 카드 틀을 실제 컴포넌트(`WeatherCard`, `SearchBar`, `BaseDashboardCard`)로 쪼개는 작업을 같이 진행했다.

### 3일차 — Vue Router / Pinia

동적 라우트(`/weather/:cityId`)와 404 catch-all, 지연 로딩(`() => import(...)`)을 연습했다. 이어서 Pinia로 온도 단위·즐겨찾기·필터 조건·검색 기록을 각각 스토어로 분리했는데, 스토어 네 개가 전부 localStorage에 저장하는 로직이 똑같길래 `persist.js`에 공통 헬퍼로 뽑아냈다.

처음에는 날씨 대시보드를 `/weather`에, 실습 목록을 `/`에 뒀는데 나중에 서비스가 완성되고 나니 순서가 어색해서 — 실제 서비스를 루트로, 실습 모음은 `/challenge`로 옮기고 예전 `/weather` 주소는 리다이렉트 처리했다.

### 4일차 — Axios / UI Libraries / Vite Build & Deployment

Axios로 OpenWeatherMap 실제 현재 날씨·예보를 가져오고, Wikipedia API로 도시 소개, Leaflet+OSM으로 지도를 붙였다. API 키를 코드에 직접 쓰면 안 된다는 걸 배워서 `.env` + `import.meta.env`로 분리하고 `.gitignore`에 등록했다.

UI 라이브러리는 배운 뒤 PrimeVue을 적용했다. Card, Button, Tag, InputText, SelectButton, Tabs, Slider 같은 컴포넌트를 화면 곳곳에 적용했고 테마는 Aura 프리셋을 썼다.

마지막으로 `npm run build`로 빌드하고 Vercel에 GitHub 연동으로 배포했다. 저장소 루트와 실제 프로젝트 폴더가 달라서 Root Directory를 따로 지정해야 했고, Vue Router가 히스토리 모드라 `vercel.json`에 SPA rewrite(`/(.*) → /index.html`) 설정을 추가하지 않으면 새로고침 시 404가 나는 걸 확인하고 고쳤다.


### 여행지 추천 기능 

1. **쾌적도 점수**: 강수확률이 낮고 기온이 이상적인 값(23도)에 가까울수록 높은 점수를 주는 간단한 계산식을 만들어서, 필터를 통과한 도시를 이 점수 순으로 정렬하고 "오늘의 추천 TOP 3"를 뽑았다.
2. **지정일 추천**: 사용자가 날짜를 골라 그 날짜의 추천을 볼 수 있게 했다. OpenWeatherMap 무료 예보 API가 내일부터 5일치까지만 주기 때문에 그 범위에서만 선택 가능하게 했고, 도시 17곳 전체를 매번 자동으로 조회하면 API 호출이 낭비되니까 사용자가 날짜를 실제로 선택했을 때만 조회하고 한 번 조회한 날짜는 캐시해뒀다.

