<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BaseDashboardCard from '../components/exercise/BaseDashboardCard.vue'
import SearchBar from '../components/exercise/SearchBar.vue'
import WeatherCard from '../components/exercise/WeatherCard.vue'
import { weatherList as weatherListData } from '../data/weatherList.js'
import { usePreferenceStore } from '../stores/preferenceStore.js'
import { fetchCurrentWeather } from '../services/weatherApi.js'

const router = useRouter()
const preferenceStore = usePreferenceStore()

const weatherList = ref(weatherListData.map((city) => ({ ...city })))
const loadError = ref('')
const searchQuery = ref('')

onMounted(async () => {
  try {
    await Promise.all(
      weatherList.value.map(async (city) => {
        const data = await fetchCurrentWeather(city.enName)
        city.temp = Math.round(data.main.temp)
        city.status = data.weather[0].description
        city.rainChance = data.clouds.all
      }),
    )
  } catch (err) {
    loadError.value =
      '실시간 날씨를 불러오지 못했습니다. (.env의 API 키를 확인하세요 — mock 데이터로 표시 중)'
    console.error(err)
  }
})

// 검색어로 먼저 좁힌 뒤, 강수/온도 조건에 맞는 여행지 필터링 (아무것도 선택 안 하면 전체 표시)
const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()
  const base = query
    ? weatherList.value.filter((item) => item.name.includes(query))
    : weatherList.value

  return base.filter((item) => {
    const matchesRain =
      preferenceStore.rainFilter === 'all' ||
      (preferenceStore.rainFilter === 'rain' && item.rainChance >= 30) ||
      (preferenceStore.rainFilter === 'no-rain' && item.rainChance < 30)
    const matchesTemp =
      preferenceStore.tempFilter === null ||
      (preferenceStore.tempFilter === 'hot' && item.temp >= 30) ||
      (preferenceStore.tempFilter === 'cool' && item.temp < 30)
    return matchesRain && matchesTemp
  })
})

// 필터 조건 변경 감시
watch(
  () => [preferenceStore.rainFilter, preferenceStore.tempFilter],
  ([rain, temp]) => {
    console.log(`[watch 감지] 필터 변경 -> 강수:${rain}, 온도:${temp ?? '전체'}`)
  },
)

const goToDetail = (city) => {
  router.push('/weather/' + city.id)
}
</script>

<template>
  <div class="dashboard-wrapper">
    <div class="page-inner">
      <section class="hero">
        <p class="hero-eyebrow">SKALA WEATHER</p>
        <h2>여행지 찾기</h2>
        <p class="hero-sub">
          희망하는 강수 조건과 온도 범위를 설정하면, 조건에 맞는 여행지를 추천해 드립니다.
        </p>
      </section>

      <p v-if="loadError" class="load-error">{{ loadError }}</p>

      <BaseDashboardCard>
        <template #title>
          <h3>조건 설정</h3>
        </template>

        <SearchBar :search-query="searchQuery" @update-query="searchQuery = $event" />

        <div class="filter-panel">
          <div class="filter-field">
            <span>강수 유무</span>
            <div class="tag-group">
              <button
                class="tag-btn rain"
                :class="{ active: preferenceStore.rainFilter === 'rain' }"
                @click="preferenceStore.setRainFilter('rain')"
              >
                강수
              </button>
              <button
                class="tag-btn dry"
                :class="{ active: preferenceStore.rainFilter === 'no-rain' }"
                @click="preferenceStore.setRainFilter('no-rain')"
              >
                맑음
              </button>
            </div>
          </div>

          <div class="filter-field">
            <span>기온</span>
            <div class="tag-group">
              <button
                class="tag-btn hot"
                :class="{ active: preferenceStore.tempFilter === 'hot' }"
                @click="preferenceStore.setTempFilter('hot')"
              >
                더움
              </button>
              <button
                class="tag-btn cool"
                :class="{ active: preferenceStore.tempFilter === 'cool' }"
                @click="preferenceStore.setTempFilter('cool')"
              >
                선선함
              </button>
            </div>
          </div>

          <button
            class="toggle-btn"
            :class="{ active: preferenceStore.isFilterActive }"
            @click="preferenceStore.resetFilters()"
          >
            조건 초기화
          </button>
        </div>
      </BaseDashboardCard>

      <BaseDashboardCard>
        <template #title>
          <h3>추천 여행지 ({{ filteredWeatherList.length }}곳)</h3>
        </template>

        <div class="cards-grid">
          <WeatherCard
            v-for="item in filteredWeatherList"
            :key="item.id"
            :city="item"
            @click-detail="goToDetail(item)"
          />
        </div>

        <p v-if="filteredWeatherList.length === 0" class="empty">조건에 맞는 여행지가 없습니다.</p>
      </BaseDashboardCard>
    </div>
  </div>
</template>

<style scoped>
.dashboard-wrapper {
  width: 100%;
  background: #f5f5f7;
  font-family:
    -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Apple SD Gothic Neo', 'Pretendard',
    sans-serif;
  color: #1d1d1f;
}

.page-inner {
  max-width: 1000px;
  margin: 0 auto;
  padding: 60px 24px 100px;
}

.hero {
  padding: 40px 32px;
  margin-bottom: 24px;
  border-radius: 24px;
  background: linear-gradient(135deg, #0071e3 0%, #42a1ff 100%);
  color: #ffffff;
}

.hero-eyebrow {
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  opacity: 0.85;
  margin-bottom: 8px;
}

.hero h2 {
  font-size: 1.8rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 8px;
}

.hero-sub {
  font-size: 0.95rem;
  opacity: 0.9;
}

h3 {
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  margin-bottom: 16px;
}

.filter-panel {
  margin-top: 18px;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 16px;
  padding: 16px;
  background: #f5f5f7;
  border-radius: 14px;
}

.filter-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.8rem;
  color: #6e6e73;
}

.tag-group {
  display: flex;
  gap: 6px;
}

.tag-btn {
  padding: 6px 14px;
  font-size: 0.8rem;
  font-weight: 600;
  background: #eef0f2;
  color: #6e6e73;
  border: 1.5px solid transparent;
  border-radius: 999px;
  cursor: pointer;
}

.tag-btn.rain.active {
  background: #e5f0ff;
  color: #0071e3;
  border-color: #0071e3;
}

.tag-btn.dry.active {
  background: #eef0f2;
  color: #1d1d1f;
  border-color: #1d1d1f;
}

.tag-btn.hot.active {
  background: #ffe5e5;
  color: #d70015;
  border-color: #d70015;
}

.tag-btn.cool.active {
  background: #eef0f2;
  color: #1d1d1f;
  border-color: #1d1d1f;
}

.toggle-btn {
  padding: 8px 18px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #0071e3;
  background: transparent;
  border: 1.5px solid #0071e3;
  border-radius: 999px;
  cursor: pointer;
  transition:
    background 0.2s ease,
    color 0.2s ease;
}

.toggle-btn:hover {
  background: #e5f0ff;
}

.toggle-btn.active {
  color: #ffffff;
  background: #0071e3;
}

.toggle-btn.active:hover {
  background: #0077ed;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
}

.empty {
  text-align: center;
  color: #e74c3c;
  padding: 10px 0;
}

.load-error {
  margin-bottom: 24px;
  padding: 12px 16px;
  font-size: 0.85rem;
  color: #d70015;
  background: #ffe5e5;
  border-radius: 12px;
}
</style>
