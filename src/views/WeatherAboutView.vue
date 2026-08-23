<template>
  <div class="dashboard-wrapper">
    <div class="page-inner">
      <div class="detail-card">
        <h3>서비스 소개</h3>
        <p>
          SKALA Vue 과정에서 배운 내용을 바탕으로 제작한 날씨 정보 서비스다. 도시 검색, 여행지 추천,
          상세 기상 정보 확인 기능을 하나의 서비스로 묶었다.
        </p>

        <div class="section-list">
          <section class="info-block">
            <h4>날씨 대시보드</h4>
            <p>
              17개 도시의 실시간 날씨를 확인할 수 있다. 도시명 검색과 초성 색인으로 원하는 도시를
              빠르게 찾을 수 있고, 즐겨찾기와 섭씨/화씨 전환을 지원한다.
            </p>
          </section>
          <section class="info-block">
            <h4>상세 페이지</h4>
            <p>
              체감온도, 습도, 기압 등 관측값과 대기질(AQI), 지도, 위키백과 도시 소개, 5일 예보를
              도시별로 확인할 수 있다.
            </p>
          </section>
          <section class="info-block">
            <h4>여행지 찾기</h4>
            <p>
              강수·기온 조건으로 도시를 필터링하고, 쾌적도 점수를 기준으로 오늘 또는 지정한 날짜의
              추천 여행지 TOP 3를 보여준다.
            </p>
          </section>
          <section class="info-block">
            <h4>Code Challenge</h4>
            <p>1~4일차에 학습한 Vue 문법 실습 코드를 주제별 탭으로 정리해둔 페이지다.</p>
          </section>
        </div>
      </div>

      <div class="detail-card">
        <h3>트러블슈팅</h3>
        <p>개발 과정에서 겪었던 문제와 해결 방법을 정리했다.</p>

        <div class="section-list">
          <section class="info-block">
            <h4>v-html과 XSS</h4>
            <p>
              입력값을 v-html로 그대로 렌더링하면 스크립트가 실행될 수 있다. 이 위험을 실습으로
              확인한 뒤, 서비스 코드에서는 v-html을 외부 API 응답 표시에만 한정해서 사용했다.
            </p>
          </section>
          <section class="info-block">
            <h4>watch가 배열·객체 변경을 감지하지 못하는 문제</h4>
            <p>
              watch의 기본 옵션은 참조값만 비교하기 때문에, 배열이나 객체 내부 값의 변경까지
              감지하려면 deep: true 옵션을 명시해야 한다.
            </p>
          </section>
          <section class="info-block">
            <h4>중복되는 스토어 저장 로직</h4>
            <p>
              온도 단위·즐겨찾기·필터·검색 기록 스토어 네 곳에서 localStorage 저장/조회 로직이
              동일하게 반복되어, persist.js에 공통 헬퍼로 분리해 재사용했다.
            </p>
          </section>
          <section class="info-block">
            <h4>배포 후 새로고침 시 404 오류</h4>
            <p>
              Vue Router의 history 모드에서는 서버가 경로를 실제 파일로 인식해 오류가 발생한다.
              vercel.json에 모든 경로를 index.html로 넘기는 rewrite 규칙을 추가해 해결했다.
            </p>
          </section>
          <section class="info-block">
            <h4>Vercel 빌드 실패</h4>
            <p>
              저장소 루트와 실제 프로젝트 폴더 위치가 달라 package.json을 찾지 못해 발생한 문제였다.
              Vercel 프로젝트 설정의 Root Directory를 지정해 해결했다.
            </p>
          </section>
          <section class="info-block">
            <h4>무료 API 호출 최소화</h4>
            <p>
              지정일 예보처럼 도시별로 여러 번 호출해야 하는 기능은 사용자가 날짜를 실제로 선택했을
              때만 조회하고, 조회한 날짜는 캐시해 중복 호출을 줄였다.
            </p>
          </section>
          <section class="info-block">
            <h4>모바일 화면에서의 레이아웃 깨짐</h4>
            <p>
              프로젝트 초기 스캐폴딩 CSS가 남아있어 발생한 문제였다. 정리하면서 여백 값도 화면 폭에
              따라 clamp()로 유동적으로 조정되도록 개선했다.
            </p>
          </section>
        </div>
      </div>

      <RouterLink to="/" class="back-link">메인 대시보드로 돌아가기</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.dashboard-wrapper {
  width: 100%;
  background: var(--weather-surface);
  font-family:
    -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Apple SD Gothic Neo', 'Pretendard',
    sans-serif;
  color: var(--weather-text);
}

.page-inner {
  max-width: 1000px;
  margin: 0 auto;
  padding: var(--space-page-top) var(--space-page-x) var(--space-page-bottom);
}

.detail-card {
  padding: 24px;
  background: var(--weather-bg);
  border-radius: 18px;
  margin-bottom: 24px;
}

.detail-card h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 12px;
}

.detail-card p {
  margin-bottom: 6px;
  color: var(--weather-text-muted);
  line-height: 1.6;
}

.section-list {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-block {
  padding: 14px 0;
  border-top: 1px solid var(--weather-border);
}

.info-block h4 {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--weather-text);
  margin-bottom: 6px;
}

.info-block p {
  margin-bottom: 0;
  font-size: 0.9rem;
}

.back-link {
  display: inline-block;
  padding: 8px 18px;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--weather-primary);
  border: 1.5px solid var(--weather-primary);
  border-radius: 999px;
  text-decoration: none;
}

.back-link:hover {
  background: var(--weather-primary-soft);
}
</style>
