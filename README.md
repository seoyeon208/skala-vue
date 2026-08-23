# SKALA Vue — 날씨 정보 서비스

- 배포: <https://skala-vue-lake-tau.vercel.app/>
- 저장소: <https://github.com/seoyeon208/skala-vue>

## 주요 기능

- 날씨 대시보드:
  17개 도시 실시간 날씨를 카드로 볼 수 있다. 도시명 검색이나 초성(ㄱ~ㅎ)으로 찾을 수 있고, 즐겨찾기 누른 도시는 목록 위쪽에 고정된다. 섭씨/화씨 전환은 전역 상태라 어느 페이지에서 바꿔도 유지된다.

- 도시 상세 페이지 (`/weather/:cityId`):
  체감온도·습도·기압·풍속·가시거리·일출일몰 같은 관측값을 알 수 있다.
  대한민국 지도에서 해당 도시의 위치를 볼 수 있다.
  위키백과 도시 소개, 5일치 예보를 확인할 수 있다.

- 여행지 찾기(`/weather/explore`):
  강수 유무랑 기온 범위를 슬라이더로 직접 설정하면, 강수확률·기온을 합쳐서 계산한 쾌적도 점수 순으로 정렬해서 오늘 또는 원하는 날짜(최대 5일 이내)의 추천 TOP 3를 보여준다.

- Code Challenge(`/challenge`):
  1~4일차에 연습한 Vue 문법 실습 코드 30여 개가 디렉티브/이벤트·v-model/Composition API/컴포넌트/외부 라이브러리 이렇게 5개 카테고리로 나뉘어 사이드바에 정리되어 있다. 지금 보고 있는 항목은 사이드바에서 강조 표시되고, 상단에는 소속 카테고리명이 크게 표시된다.

- 서비스 소개(`/weather/about`):
  페이지 기능 요약과 개발하면서 겪은 트러블 슈팅을 기술해놓았다.

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

## 과제 요구사항

### 1. 날씨 Mockup

**요구사항**

1. 배열 렌더링(v-for) — 임의의 날씨 데이터 배열로 카드를 반복 출력, `:key`에 id 바인딩
2. 조건부 렌더링(v-if) — 기온 25도 기준으로 "더움"/"선선함" 라벨 분기
3. 양방향 바인딩 및 한글 처리(`:value`, `@input`) — 도시명을 한글로 검색하는 input 구현
4. 이벤트 및 수식어 — 카드 클릭 시 상태바에 문구 표시, 상세보기 버튼은 버블링 없이 `window.alert`로 날씨 출력
5. 본인만의 데이터 추가

**개발 과정**

- `weatherList`를 `ref` 배열로 선언하고 `v-for` + `:key`로 카드 렌더링
- `temp` 값 기준 `v-if`/`v-else`로 라벨 분기
- 검색 input은 `v-model` 대신 `:value` + `@input`으로 직접 구현해서 양방향 바인딩 원리를 익힘
- 카드 클릭과 상세보기 버튼 클릭이 겹치는 문제 → `.stop` 수식어로 버블링 차단
- 도시 데이터에 본인 취향 도시 추가

### 2. 날씨 Composition

**요구사항**

1. 반응형 상태 관리 — `searchQuery`, `selectedCityInfo`, `weatherList`를 반응형 상태로 정의
2. 검색 도시 필터링(computed) — 검색어에 포함된 항목만 `filteredWeatherList`로 계산
3. 반응형 변수 감시(watch, watchEffect) — `selectedCityInfo`는 watch로, `searchQuery`는 watchEffect로 콘솔 로그
4. 검색 결과 표시 — 검색어 없음 / 일치 / 불일치 3가지 템플릿 분기
5. 본인만의 반응형 상태·computed·watcher 추가

**개발 과정**

- `ref`/`computed`/`watch`/`watchEffect`를 각각 어디에 써야 하는지 헷갈려서 예제를 여러 개 만들어보며 익힘
- `filteredWeatherList`를 computed로 구현
- watch로 상태바 문구 변경 로그, watchEffect로 검색어 변경 자동 추적
- 이 필터링 로직을 이후 "여행지 찾기" 기능으로 발전

### 3. 날씨 Component

**요구사항**

1. `WeatherParent.vue` — 모든 반응형 데이터 유지
2. `BaseDashboardCard.vue` — 검색박스·리스트박스 디자인 공통화, slot으로 자식 컴포넌트 주입
3. `SearchBar.vue` — props로 검색어 전달받고 `update-query` emit
4. `WeatherCard.vue` — props로 도시 객체 전달받고 `select-card`/`click-detail` emit
5. 각 컴포넌트 디자인은 `<style scoped>`로 분리
6. 본인 Mockup 부분에 컴포넌트 추가 분리

**개발 과정**

- 요구사항대로 4개 컴포넌트로 나누고 slot·props·emits 구조 구현
- 이 구조를 실제 서비스 컴포넌트(`components/exercise/`)로 그대로 옮겨서 날씨 대시보드·여행지 찾기 페이지 양쪽에서 재사용

### 4. 날씨 Router

**요구사항**

1. Vue Router 설정 — 지연 로딩 적용, catch-all route 적용
2. `App.vue` — 내비게이션 바(RouterLink)와 `<RouterView />` 배치
3. `WeatherHomeView.vue` — `window.alert()` 제거하고 `router.push`로 상세 페이지 이동
4. `WeatherDetailView.vue` — 동적 라우트 `:cityId`로 mock 데이터에서 도시 조회
5. `WeatherAboutView.vue` — 소개 내용 작성
6. 본인 추가 view 작성 및 라우팅

**개발 과정**

- 라우트에 `() => import(...)`로 지연 로딩 적용
- 정의되지 않은 경로는 `NotFoundView`로 catch-all 처리
- 상세보기 클릭 시 `router.push('/weather/' + city.id)`로 Programmatic Navigation 구현
- 요구사항대로 처음엔 날씨 대시보드를 `/weather`에, 실습 목록을 `/`에 배치 → 서비스가 완성된 뒤엔 순서가 어색해서 날씨 대시보드를 `/`로, 실습 모음을 `/challenge`로 이동하고 예전 `/weather` 주소는 리다이렉트 처리
- 본인 추가 view로 여행지 찾기(`WeatherExploreView`) 제작

### 5. 날씨 Axios

**요구사항**

1. OpenWeatherMap API로 실제 날씨 데이터를 가져와 적용
2. OpenWeatherMap이 제공하는 API를 추가해 기능 확장
3. 기타 외부 API를 추가해 기능 확장

**개발 과정**

- `weatherApi.js`에 axios로 현재 날씨 API 연동
- OpenWeatherMap 추가 API로 5일 예보, 대기질(AQI) 붙임
- 기타 외부 API로 위키백과 REST API(도시 소개), Leaflet + OpenStreetMap(지도) 추가
- API 키를 코드에 직접 쓰면 안 된다는 걸 배워서 `.env` + `import.meta.env`로 분리, `.gitignore` 등록

### 6. 날씨 UI Library

**요구사항**

1. 외부 UI 라이브러리 선정
2. 3일차(컴포넌트 분리) 과제에 자유롭게 적용

**개발 과정**

- Vuetify(Material 느낌이 강함) · Element Plus(관리자 페이지 느낌) · PrimeVue(컴포넌트 종류 많고 점유율 높음) 비교 → PrimeVue 선택
- Card, Button, Tag, InputText, SelectButton, Tabs, Slider를 실제 컴포넌트 곳곳에 적용
- 테마는 Aura 프리셋 사용

### 7. 날씨 Deployment

**요구사항**

1. ESLint로 점검해 제출 과제의 에러를 없앨 것
2. API 키는 환경 변수로 처리하고 Git에 업로드되지 않도록 할 것
3. 프로젝트를 빌드할 것
4. 빌드된 정적 파일을 본인 서버에 호스팅한 후 확인할 것

**개발 과정**

- `npm run lint`로 ESLint/oxlint 에러 제거
- `npm run build`로 빌드 후 Vercel에 GitHub 연동으로 배포
- 저장소 루트와 실제 프로젝트 폴더 위치가 달라 Root Directory를 따로 지정
- Vue Router가 history 모드라 `vercel.json`에 SPA rewrite(`/(.*) → /index.html`)를 추가하지 않으면 새로고침 시 404 발생 → 확인 후 수정

### 요구사항 이후 추가한 기능

강수·기온 필터만 있던 여행지 찾기가 밋밋해서, 쾌적도 점수(강수확률 낮고 기온이 23도에 가까울수록 높은 점수)로 정렬해서 오늘의 추천 TOP 3를 뽑는 기능을 넣었다. 날짜별로도 보고 싶어서 지정일 추천도 추가했는데, 무료 예보 API가 5일치까지만 줘서 그 안에서만 선택되게 했고, 도시 17곳을 매번 자동 조회하면 낭비니까 날짜를 실제로 눌렀을 때만 불러오고 캐시해뒀다.

그다음엔 화면 다듬는 작업. 색이 파일마다 조금씩 다르게 박혀있어서 CSS 변수로 모았고, 날씨 아이콘도 API 응답에 이미 있던 코드로 추가했다. 모바일 폭으로 줄여서 봤더니 상단 네비게이션이 이상하게 깨져 있어서 그것도 정리하고, 여백도 화면 크기에 따라 clamp()로 알아서 줄어들게 했다.

마지막으로 서비스 소개 페이지에 트러블슈팅 기록을 남겼다.
