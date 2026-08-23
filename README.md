# SKALA Vue — 날씨 정보 서비스

- 배포: <https://skala-vue-lake-tau.vercel.app/>
- 저장소: <https://github.com/seoyeon208/skala-vue>

## 주요 기능

- **날씨 대시보드** (`/`) — 17개 도시 실시간 날씨, 도시 검색, 초성 색인, 즐겨찾기, 섭씨/화씨 전환
- **상세 페이지** (`/weather/:cityId`) — 체감온도·습도·기압 등 관측값, 대기질(AQI), 지도, 위키백과 도시 소개, 5일 예보
- **여행지 찾기** (`/weather/explore`) — 강수·기온 조건 필터, 쾌적도 점수 기반 오늘/지정일 추천 TOP 3
- **Code Challenge** (`/challenge`) — 1~4일차 Vue 문법 실습 코드를 주제별 탭으로 정리
- **서비스 소개** (`/weather/about`) — 서비스 설명과 개발 중 겪은 트러블슈팅 기록

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

**요구사항**: 임의의 날씨 데이터 배열을 v-for로 카드 반복 렌더링(:key 필수), 기온에 따라 v-if로 라벨 분기, 도시 검색 input을 :value/@input으로 양방향 바인딩하고 한글 입력 처리, 카드 클릭 시 상태바에 문구 표시, 상세보기 버튼은 버블링 없이 window.alert로 날씨 정보 출력, 본인 데이터 추가.

**개발 과정**: weatherList를 ref 배열로 선언하고 v-for/:key로 카드를 렌더링했다. temp 값 기준으로 v-if/v-else 분기를 넣었고, 검색 input은 v-model 대신 :value + @input으로 직접 구현해서 양방향 바인딩 원리를 익혔다. 카드 클릭과 상세보기 버튼 클릭이 겹치는 문제는 .stop 수식어로 버블링을 막아 해결했다.

### 2. 날씨 Composition

**요구사항**: searchQuery/selectedCityInfo/weatherList를 반응형 상태로 관리, computed로 검색어에 맞는 도시만 필터링, watch로 selectedCityInfo 감시, watchEffect로 searchQuery 감시, 검색 결과 유무에 따른 화면 분기, 본인 반응형 상태 추가.

**개발 과정**: ref/computed/watch/watchEffect를 각각 어디에 써야 하는지 헷갈려서 예제를 여러 개 만들어보며 익혔다. filteredWeatherList를 computed로 구현하고, watch로 상태바 문구 변경을, watchEffect로 검색어 변경을 콘솔에 로그로 남겼다. 이 필터링 로직을 이후 "여행지 찾기" 기능으로 발전시켰다.

### 3. 날씨 Component

**요구사항**: 기능 변경 없이 WeatherParent/BaseDashboardCard/SearchBar/WeatherCard 4개 컴포넌트로 분리, BaseDashboardCard는 slot으로 검색 영역과 리스트 영역의 디자인을 공통화, SearchBar는 props로 검색어를 받고 update-query를 emit, WeatherCard는 props로 도시 객체를 받고 select-card/click-detail을 emit.

**개발 과정**: 요구사항대로 4개 컴포넌트로 나누고 slot·props·emits 구조를 잡았다. 이 구조를 그대로 실제 서비스 컴포넌트(`components/exercise/`)로 옮겨서, 날씨 대시보드·여행지 찾기 페이지 양쪽에서 재사용했다.

### 4. 날씨 Router

**요구사항**: Vue Router 설정(지연 로딩, catch-all route 적용), App.vue에 내비게이션 바 추가, WeatherHomeView(상세보기 클릭 시 window.alert 대신 router.push로 이동), WeatherDetailView(동적 라우트 :cityId로 mock 데이터에서 도시 조회), WeatherAboutView, 본인 추가 view.

**개발 과정**: 라우트에 `() => import(...)`로 지연 로딩을 적용하고, 정의되지 않은 경로는 NotFoundView로 catch-all 처리했다. 상세보기 클릭 시 `router.push('/weather/' + city.id)`로 Programmatic Navigation을 구현했다. 요구사항대로 처음엔 날씨 대시보드를 `/weather`에, 실습 목록을 `/`에 뒀는데, 서비스가 완성된 뒤엔 순서가 어색해서 날씨 대시보드를 `/`로, 실습 모음을 `/challenge`로 옮기고 예전 `/weather` 주소는 리다이렉트 처리했다. 본인 추가 view로는 여행지 찾기(WeatherExploreView)를 만들었다.

### 5. 날씨 Axios

**요구사항**: OpenWeatherMap API로 실제 날씨 데이터를 가져오고, OpenWeatherMap이 제공하는 다른 API나 기타 외부 API를 추가해 기능을 확장.

**개발 과정**: `weatherApi.js`에 axios로 현재 날씨 API를 연동한 뒤 5일 예보, 대기질(AQI) API를 추가했다. 기타 외부 API로는 위키백과 REST API(도시 소개)와 Leaflet + OpenStreetMap(지도)을 붙였다. API 키를 코드에 직접 쓰면 안 된다는 걸 배워서 `.env` + `import.meta.env`로 분리하고 `.gitignore`에 등록했다.

### 6. 날씨 UI Library

**요구사항**: 외부 UI 라이브러리를 선정해 3일차(컴포넌트 분리) 과제에 자유롭게 적용.

**개발 과정**: Vuetify(Material 느낌이 강함), Element Plus(관리자 페이지 느낌), PrimeVue(컴포넌트 종류가 많고 점유율도 높음) 중에 고민하다 PrimeVue로 정했다. Card, Button, Tag, InputText, SelectButton, Tabs, Slider를 실제 컴포넌트 곳곳에 적용했고 테마는 Aura 프리셋을 썼다.

### 7. 날씨 Deployment

**요구사항**: ESLint로 점검해 에러 없앨 것, API 키는 환경 변수로 분리해 Git에 올라가지 않게 할 것, 프로젝트 빌드 후 정적 파일을 본인 서버에 호스팅해 확인할 것.

**개발 과정**: `npm run lint`로 ESLint/oxlint 에러를 없애고, `npm run build`로 빌드한 뒤 Vercel에 GitHub 연동으로 배포했다. 저장소 루트와 실제 프로젝트 폴더 위치가 달라 Root Directory를 따로 지정해야 했고, Vue Router가 history 모드라 `vercel.json`에 SPA rewrite(`/(.*) → /index.html`) 설정을 추가하지 않으면 새로고침 시 404가 나는 걸 확인하고 고쳤다.

### 요구사항 이후 추가한 기능

일곱 단계를 다 마치고 나서, 배운 걸 더 써보고 싶어서 추가로 진행한 부분이다.

- **여행지 추천 고도화**: 강수·기온 조건 필터만 있던 걸 쾌적도 점수(강수확률 낮고 기온이 23도에 가까울수록 높은 점수) 기반으로 정렬해서 "오늘의 추천 TOP 3"를 뽑았다. 이어서 날짜를 선택해 지정일 추천도 볼 수 있게 했는데, 무료 예보 API가 5일치까지만 지원해서 그 범위에서만 선택 가능하게 하고, 도시 17곳을 매번 자동 조회하지 않도록 날짜를 실제로 선택했을 때만 조회하고 캐시해뒀다.
- **화면 다듬기**: 색상 값이 파일마다 조금씩 다르게 박혀있어서 CSS 변수로 모았고, 날씨 아이콘을 API 응답에 이미 있던 아이콘 코드로 추가했다. 모바일 폭에서 상단 내비게이션이 깨지는 것도 발견해서 정리하고, 여백 값도 화면 폭에 따라 clamp()로 유동적으로 조정되게 했다.
- **정리**: 어디서도 쓰이지 않던 스캐폴딩 기본 파일(HomeView, AboutView 등)을 정리하고, 서비스 소개 페이지에 트러블슈팅 기록을 남겼다.
  ㄴ
