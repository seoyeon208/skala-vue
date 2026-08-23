<script setup>
import { ref, computed, watch, watchEffect, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BaseDashboardCard from '../components/exercise/BaseDashboardCard.vue'
import SearchBar from '../components/exercise/SearchBar.vue'
import WeatherCard from '../components/exercise/WeatherCard.vue'
import { weatherList as weatherListData } from '../data/weatherList.js'
import { useFavoriteStore } from '../stores/favoriteStore.js'
import { useConfigStore } from '../stores/configStore.js'
import { fetchCurrentWeather } from '../services/weatherApi.js'

const router = useRouter()
const favoriteStore = useFavoriteStore()
const configStore = useConfigStore()

// mock 데이터를 복사해서 초기값(fallback)으로 사용, API 로딩 완료 시 실제 값으로 덮어씀
const weatherList = ref(weatherListData.map((city) => ({ ...city })))
const loadError = ref('')

onMounted(async () => {
  try {
    await Promise.all(
      weatherList.value.map(async (city) => {
        const data = await fetchCurrentWeather(city.enName)
        city.temp = Math.round(data.main.temp)
        city.status = data.weather[0].description
        city.icon = data.weather[0].icon
        city.rainChance = data.clouds.all // 강수확률 API가 없어 구름량(%)을 근사치로 사용
      }),
    )
  } catch (err) {
    loadError.value =
      '실시간 날씨를 불러오지 못했습니다. (.env의 API 키를 확인하세요 — mock 데이터로 표시 중)'
    console.error(err)
  }
})

const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')

// 초성 색인: ㄱㄴㄷ... 클릭으로 해당 자음 도시만 보기
const CONSONANTS = [
  'ㄱ',
  'ㄴ',
  'ㄷ',
  'ㄹ',
  'ㅁ',
  'ㅂ',
  'ㅅ',
  'ㅇ',
  'ㅈ',
  'ㅊ',
  'ㅋ',
  'ㅌ',
  'ㅍ',
  'ㅎ',
]
const INITIALS = [
  'ㄱ',
  'ㄲ',
  'ㄴ',
  'ㄷ',
  'ㄸ',
  'ㄹ',
  'ㅁ',
  'ㅂ',
  'ㅃ',
  'ㅅ',
  'ㅆ',
  'ㅇ',
  'ㅈ',
  'ㅉ',
  'ㅊ',
  'ㅋ',
  'ㅌ',
  'ㅍ',
  'ㅎ',
]
const selectedConsonant = ref(null)

function getInitialConsonant(char) {
  const code = char.charCodeAt(0) - 0xac00
  if (code < 0 || code > 11171) return null
  return INITIALS[Math.floor(code / 588)]
}

const availableConsonants = computed(() => {
  const set = new Set()
  weatherList.value.forEach((item) => {
    const c = getInitialConsonant(item.name[0])
    if (c) set.add(c)
  })
  return set
})

const displayWeatherList = computed(() => {
  const query = searchQuery.value.trim()
  let base = query
    ? weatherList.value.filter((item) => item.name.includes(query))
    : weatherList.value

  if (selectedConsonant.value) {
    base = base.filter((item) => getInitialConsonant(item.name[0]) === selectedConsonant.value)
  }

  // ㄱㄴㄷ순 정렬
  return [...base].sort((a, b) => a.name.localeCompare(b.name, 'ko'))
})

watch(selectedCityInfo, (newInfo) => {
  console.log(`[watch 감지] 상태바 문구가 업데이트되었습니다 -> "${newInfo}"`)
})

watchEffect(() => {
  console.log(
    `[watchEffect 자동 호출] 현재 검색어 '${searchQuery.value}'에 매칭되는 API 데이터를 필터링합니다.`,
  )
})

// 즐겨찾기한 도시를 목록 상단으로 정렬
const sortedWeatherList = computed(() => {
  return [...displayWeatherList.value].sort((a, b) => {
    const aFav = favoriteStore.isFavorite(a.id) ? 1 : 0
    const bFav = favoriteStore.isFavorite(b.id) ? 1 : 0
    return bFav - aFav // 즐겨찾기(1)가 앞으로
  })
})

// 페이지 상단 요약 지표
const averageTemp = computed(() => {
  if (weatherList.value.length === 0) return 0
  const sum = weatherList.value.reduce((acc, item) => acc + item.temp, 0)
  return Math.round(sum / weatherList.value.length)
})

// 상세보기 클릭 시 alert 대신 상세 페이지로 이동 (Programmatic Navigation)
const showDetail = (city) => {
  router.push('/weather/' + city.id)
}
</script>

<template>
  <div class="dashboard-wrapper">
    <div class="page-inner">
      <section class="hero">
        <p class="hero-eyebrow">SKALA WEATHER</p>
        <h2>전국 주요 도시 날씨 정보</h2>
        <p class="hero-sub">실시간 기상 데이터를 기반으로 도시별 날씨를 확인할 수 있습니다.</p>

        <div class="stats-row">
          <div class="stat-tile">
            <p class="stat-value">{{ weatherList.length }}</p>
            <p class="stat-label">등록된 도시</p>
          </div>
          <div class="stat-tile">
            <p class="stat-value">{{ averageTemp }}{{ configStore.unitSymbol }}</p>
            <p class="stat-label">평균 기온</p>
          </div>
          <div class="stat-tile">
            <p class="stat-value">{{ favoriteStore.favoriteIds.length }}</p>
            <p class="stat-label">즐겨찾기</p>
          </div>
        </div>
      </section>

      <p v-if="loadError" class="load-error">{{ loadError }}</p>

      <BaseDashboardCard>
        <template #title>
          <h3>도시 검색</h3>
        </template>

        <SearchBar :search-query="searchQuery" @update-query="searchQuery = $event" />

        <div class="consonant-index">
          <button
            class="consonant-btn"
            :class="{ active: selectedConsonant === null }"
            @click="selectedConsonant = null"
          >
            전체
          </button>
          <button
            v-for="c in CONSONANTS"
            :key="c"
            class="consonant-btn"
            :class="{ active: selectedConsonant === c }"
            :disabled="!availableConsonants.has(c)"
            @click="selectedConsonant = c"
          >
            {{ c }}
          </button>
        </div>
      </BaseDashboardCard>

      <BaseDashboardCard>
        <template #title>
          <h3>지역별 날씨 현황</h3>
        </template>

        <div class="cards-grid">
          <WeatherCard
            v-for="item in sortedWeatherList"
            :key="item.id"
            :city="item"
            @select-card="selectedCityInfo = `${item.name}이 선택되었습니다.`"
            @click-detail="showDetail(item)"
          />
        </div>

        <p v-if="displayWeatherList.length === 0" class="empty">
          검색 결과와 일치하는 도시가 없습니다.
        </p>
      </BaseDashboardCard>

      <div class="status-bar">
        {{ selectedCityInfo }}
      </div>
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
  margin-bottom: 28px;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
}

.stat-tile {
  padding: 16px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 14px;
  text-align: center;
  backdrop-filter: blur(4px);
}

.stat-value {
  font-size: 1.4rem;
  font-weight: 700;
}

.stat-label {
  font-size: 0.75rem;
  opacity: 0.85;
  margin-top: 2px;
}

h3 {
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  margin-bottom: 16px;
}

.consonant-index {
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.consonant-btn {
  padding: 3px 7px;
  font-size: 0.7rem;
  color: var(--weather-text-muted);
  background: none;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.consonant-btn:hover:not(:disabled) {
  background: var(--weather-bg);
}

.consonant-btn.active {
  color: var(--weather-primary);
  font-weight: 700;
}

.consonant-btn:disabled {
  color: var(--weather-border);
  cursor: default;
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

.status-bar {
  text-align: center;
  padding: 16px;
  font-size: 0.9rem;
  color: var(--weather-text-muted);
  background: var(--weather-surface);
  border-radius: 12px;
  margin-top: 40px;
}
</style>
