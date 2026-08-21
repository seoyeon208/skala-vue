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
  background: #ffffff;
  font-family:
    -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Apple SD Gothic Neo', 'Pretendard',
    sans-serif;
  color: #1d1d1f;
}

.not-found {
  max-width: 400px;
  margin: 0 auto;
  padding: 100px 24px;
  text-align: center;
}

.icon {
  font-size: 2.5rem;
  font-weight: 700;
  color: #0071e3;
  margin-bottom: 16px;
}

.not-found h3 {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 8px;
}

.desc {
  color: #6e6e73;
  margin-bottom: 24px;
}

.back-link {
  display: inline-block;
  padding: 10px 20px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #ffffff;
  background: #0071e3;
  border-radius: 999px;
  text-decoration: none;
}

.back-link:hover {
  background: #0077ed;
}
</style>
