<script setup>
import { RouterLink, RouterView } from 'vue-router'
import UnitToggler from './components/exercise/UnitToggler.vue'
</script>

<template>
  <h1>SKALA Weather</h1>
  <div class="nav-bar">
    <nav>
      <RouterLink to="/">날씨 대시보드</RouterLink>
      <RouterLink to="/weather/explore">여행지 찾기</RouterLink>
      <RouterLink to="/challenge">Code Challenge</RouterLink>
    </nav>
    <UnitToggler />
  </div>
  <RouterView />
</template>

<style scoped>
.nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 12px;
}

nav {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 18px;
}

nav a {
  font-size: 0.85rem;
  color: var(--weather-text-muted);
  text-decoration: none;
}

nav a.router-link-exact-active {
  color: var(--weather-primary);
  font-weight: 600;
}
</style>
