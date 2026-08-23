<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Slider from 'primevue/slider'
import BaseDashboardCard from '../components/exercise/BaseDashboardCard.vue'
import SearchBar from '../components/exercise/SearchBar.vue'
import WeatherCard from '../components/exercise/WeatherCard.vue'
import { weatherList as weatherListData } from '../data/weatherList.js'
import { usePreferenceStore } from '../stores/preferenceStore.js'
import { fetchCurrentWeather, fetchForecast, WEATHER_LOAD_ERROR } from '../services/weatherApi.js'

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
        city.icon = data.weather[0].icon
        city.rainChance = data.clouds.all
      }),
    )
  } catch (err) {
    loadError.value = WEATHER_LOAD_ERROR
    console.error(err)
  }
})

// 쾌적도 점수: 강수확률이 낮고, 기온이 이상적인 범위(23도)에 가까울수록 높은 점수
const IDEAL_TEMP = 23
function comfortScore(city) {
  return 100 - city.rainChance - Math.abs(city.temp - IDEAL_TEMP) * 2
}

function comfortReason(city) {
  return `강수확률 ${city.rainChance}% · ${city.temp}°C`
}

// 지정일 추천: 오늘(null)이 아니면 forecast API로 해당 날짜의 예보를 도시별로 모아 평균낸다
const selectedDate = ref(null)
const dateForecastCache = ref({})
const isLoadingForecast = ref(false)
const forecastError = ref('')

// 무료 forecast API가 제공하는 범위(내일부터 5일치)만 선택 가능
const availableDates = computed(() => {
  const dates = []
  for (let i = 1; i <= 5; i++) {
    const d = new Date()
    d.setDate(d.getDate() + i)
    dates.push(d.toISOString().slice(0, 10))
  }
  return dates
})

function formatDateLabel(dateStr) {
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  })
}

async function loadForecastForDate(dateStr) {
  isLoadingForecast.value = true
  forecastError.value = ''
  try {
    const results = await Promise.all(
      weatherList.value.map(async (city) => {
        const data = await fetchForecast(city.enName)
        const entries = data.list.filter((entry) => entry.dt_txt.slice(0, 10) === dateStr)
        if (entries.length === 0) return null
        const avgTemp = entries.reduce((sum, entry) => sum + entry.main.temp, 0) / entries.length
        const avgPop = (entries.reduce((sum, entry) => sum + entry.pop, 0) / entries.length) * 100
        return {
          id: city.id,
          name: city.name,
          temp: Math.round(avgTemp),
          rainChance: Math.round(avgPop),
        }
      }),
    )
    dateForecastCache.value[dateStr] = results.filter(Boolean)
  } catch (err) {
    forecastError.value = '해당 날짜의 예보를 불러오지 못했습니다. (.env의 API 키를 확인하세요)'
    console.error(err)
  } finally {
    isLoadingForecast.value = false
  }
}

async function selectDate(dateStr) {
  selectedDate.value = dateStr
  if (dateStr && !dateForecastCache.value[dateStr]) {
    await loadForecastForDate(dateStr)
  }
}

// 추천 TOP 3: 오늘이면 현재 날씨 목록, 지정일이면 그 날짜의 예보 평균값 기준
const top3Source = computed(() => {
  if (!selectedDate.value) return weatherList.value
  return dateForecastCache.value[selectedDate.value] || []
})

const top3Title = computed(() => {
  return selectedDate.value
    ? `${formatDateLabel(selectedDate.value)} 추천 TOP 3`
    : '오늘의 추천 TOP 3'
})

const top3 = computed(() => {
  return [...top3Source.value].sort((a, b) => comfortScore(b) - comfortScore(a)).slice(0, 3)
})

// 검색어로 먼저 좁힌 뒤, 강수/온도 조건에 맞는 여행지 필터링 (아무것도 선택 안 하면 전체 표시)
// 필터를 통과한 여행지는 쾌적도 점수가 높은 순으로 정렬
const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()
  const base = query
    ? weatherList.value.filter((item) => item.name.includes(query))
    : weatherList.value

  return base
    .filter((item) => {
      const matchesRain =
        preferenceStore.rainFilter === 'all' ||
        (preferenceStore.rainFilter === 'rain' && item.rainChance >= 30) ||
        (preferenceStore.rainFilter === 'no-rain' && item.rainChance < 30)
      const [tempMin, tempMax] = preferenceStore.tempRange
      const matchesTemp = item.temp >= tempMin && item.temp <= tempMax
      return matchesRain && matchesTemp
    })
    .sort((a, b) => comfortScore(b) - comfortScore(a))
})

// 필터 조건 변경 감시
watch(
  () => [preferenceStore.rainFilter, preferenceStore.tempRange],
  ([rain, temp]) => {
    console.log(`[watch 감지] 필터 변경 -> 강수:${rain}, 온도:${temp[0]}~${temp[1]}°C`)
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
          <h3>{{ top3Title }}</h3>
        </template>

        <div class="date-tabs">
          <button class="date-tab" :class="{ active: !selectedDate }" @click="selectDate(null)">
            오늘
          </button>
          <button
            v-for="date in availableDates"
            :key="date"
            class="date-tab"
            :class="{ active: selectedDate === date }"
            @click="selectDate(date)"
          >
            {{ formatDateLabel(date) }}
          </button>
        </div>

        <p v-if="isLoadingForecast" class="top3-status">예보를 불러오는 중...</p>
        <p v-else-if="forecastError" class="top3-status error">{{ forecastError }}</p>

        <div v-else class="top3-row">
          <div
            v-for="(city, index) in top3"
            :key="city.id"
            class="top3-card"
            @click="goToDetail(city)"
          >
            <span class="top3-rank">{{ index + 1 }}</span>
            <div class="top3-info">
              <p class="top3-name">{{ city.name }}</p>
              <p class="top3-reason">{{ comfortReason(city) }}</p>
            </div>
          </div>
        </div>
      </BaseDashboardCard>

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

          <div class="filter-field temp-field">
            <span
              >기온 {{ preferenceStore.tempRange[0] }}°C ~
              {{ preferenceStore.tempRange[1] }}°C</span
            >
            <Slider
              class="temp-slider"
              :model-value="preferenceStore.tempRange"
              range
              :min="preferenceStore.TEMP_MIN"
              :max="preferenceStore.TEMP_MAX"
              @update:model-value="preferenceStore.setTempRange($event)"
            />
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
  background: var(--weather-bg);
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

.hero {
  padding: var(--space-hero-y) var(--space-hero-x);
  margin-bottom: 24px;
  border-radius: 24px;
  background: linear-gradient(135deg, var(--weather-primary) 0%, var(--weather-accent) 100%);
  color: var(--weather-surface);
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

.date-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
}

.date-tab {
  padding: 6px 14px;
  font-size: 0.8rem;
  font-weight: 600;
  background: var(--weather-neutral-soft);
  color: var(--weather-text-muted);
  border: 1.5px solid transparent;
  border-radius: 999px;
  cursor: pointer;
}

.date-tab.active {
  background: var(--weather-primary-soft);
  color: var(--weather-primary);
  border-color: var(--weather-primary);
}

.top3-status {
  font-size: 0.85rem;
  color: var(--weather-text-muted);
}

.top3-status.error {
  color: var(--weather-danger);
}

.top3-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 14px;
}

.top3-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  background: var(--weather-bg);
  border-radius: 14px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.top3-card:hover {
  background: var(--weather-primary-soft);
}

.top3-rank {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--weather-surface);
  background: var(--weather-primary);
  border-radius: 50%;
}

.top3-name {
  font-size: 1rem;
  font-weight: 600;
}

.top3-reason {
  font-size: 0.8rem;
  color: var(--weather-text-muted);
}

.filter-panel {
  margin-top: 18px;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 16px;
  padding: 16px;
  background: var(--weather-bg);
  border-radius: 14px;
}

.filter-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.8rem;
  color: var(--weather-text-muted);
}

.tag-group {
  display: flex;
  gap: 6px;
}

.tag-btn {
  padding: 6px 14px;
  font-size: 0.8rem;
  font-weight: 600;
  background: var(--weather-neutral-soft);
  color: var(--weather-text-muted);
  border: 1.5px solid transparent;
  border-radius: 999px;
  cursor: pointer;
}

.tag-btn.rain.active {
  background: var(--weather-primary-soft);
  color: var(--weather-primary);
  border-color: var(--weather-primary);
}

.tag-btn.dry.active {
  background: var(--weather-neutral-soft);
  color: var(--weather-text);
  border-color: var(--weather-text);
}

.temp-field {
  flex: 1;
  min-width: 220px;
}

.temp-slider {
  margin-top: 4px;
}

.toggle-btn {
  padding: 8px 18px;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--weather-primary);
  background: transparent;
  border: 1.5px solid var(--weather-primary);
  border-radius: 999px;
  cursor: pointer;
  transition:
    background 0.2s ease,
    color 0.2s ease;
}

.toggle-btn:hover {
  background: var(--weather-primary-soft);
}

.toggle-btn.active {
  color: var(--weather-surface);
  background: var(--weather-primary);
}

.toggle-btn.active:hover {
  background: var(--weather-primary-hover);
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
}

.empty {
  text-align: center;
  color: var(--weather-danger);
  padding: 10px 0;
}

.load-error {
  margin-bottom: 24px;
  padding: 12px 16px;
  font-size: 0.85rem;
  color: var(--weather-danger);
  background: var(--weather-danger-soft);
  border-radius: 12px;
}
</style>
