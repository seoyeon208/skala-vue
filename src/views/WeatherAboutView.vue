<template>
  <div class="dashboard-wrapper">
    <div class="page-inner">
      <div class="detail-card">
        <h3>서비스 소개</h3>
        <p>
          본 서비스는 Vue 3 Composition API와 컴포넌트 분리, Vue Router 학습을 위해 제작된 날씨 정보
          대시보드입니다.
        </p>
        <p>실시간 도시 검색, 강수 및 온도 조건 필터, 도시별 상세 기상 정보를 제공합니다.</p>
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
