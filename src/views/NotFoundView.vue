<template>
  <div class="dashboard-wrapper">
    <div class="page-inner not-found">
      <p class="icon">404</p>
      <h3>페이지를 찾을 수 없습니다.</h3>
      <p class="desc">요청하신 주소가 존재하지 않거나, 아직 개발되지 않았습니다.</p>
      <RouterLink to="/" class="back-link">날씨 메인으로 돌아가기</RouterLink>
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

.not-found {
  max-width: 400px;
  margin: 0 auto;
  padding: var(--space-page-bottom) var(--space-page-x);
  text-align: center;
}

.icon {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--weather-primary);
  margin-bottom: 16px;
}

.not-found h3 {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 8px;
}

.desc {
  color: var(--weather-text-muted);
  margin-bottom: 24px;
}

.back-link {
  display: inline-block;
  padding: 10px 20px;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--weather-surface);
  background: var(--weather-primary);
  border-radius: 999px;
  text-decoration: none;
}

.back-link:hover {
  background: var(--weather-primary-hover);
}
</style>
