<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import { weatherList } from '../data/weatherList.js'
import { useConfigStore } from '../stores/configStore.js'
import { fetchCurrentWeather, fetchForecast, fetchAirPollution } from '../services/weatherApi.js'
import { fetchCitySummary } from '../services/wikiApi.js'
import Tag from 'primevue/tag'

// Vite 번들 환경에서 Leaflet 기본 마커 아이콘 경로가 깨지는 문제 보정
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

const route = useRoute()
const city = ref(null)
const configStore = useConfigStore()
const mapContainer = ref(null)

const detail = ref(null)
const forecastList = ref([])
const citySummary = ref('')
const detailError = ref('')
const airQuality = ref(null)

// OpenWeatherMap 대기질 지수(1~5) 라벨/색상
const aqiLabel = { 1: '좋음', 2: '양호', 3: '보통', 4: '나쁨', 5: '매우나쁨' }
const aqiSeverity = { 1: 'success', 2: 'info', 3: 'warn', 4: 'danger', 5: 'danger' }

function formatTime(unixSeconds) {
  return new Date(unixSeconds * 1000).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatDateLabel(dateStr) {
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  })
}

// 위키백과 요약은 줄바꿈 없이 한 덩어리로 오는 경우가 많아, 문장 2개씩 묶어 문단으로 재구성
function splitIntoParagraphs(text) {
  if (!text) return []

  const byNewline = text
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
  if (byNewline.length > 1) return byNewline

  const sentences = text.match(/[^.]+\.\s*/g) || [text]
  const paragraphs = []
  for (let i = 0; i < sentences.length; i += 2) {
    paragraphs.push(
      sentences
        .slice(i, i + 2)
        .join('')
        .trim(),
    )
  }
  return paragraphs
}

// Router 동적 경로 매칭(cityId)을 기반으로 Mount 시점에 Mock Data에서 도시 객체 선택
onMounted(async () => {
  city.value = weatherList.find((item) => item.id === route.params.cityId)
  if (!city.value) return

  try {
    const data = await fetchCurrentWeather(city.value.enName)
    detail.value = {
      temp: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      tempMin: Math.round(data.main.temp_min),
      tempMax: Math.round(data.main.temp_max),
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      windSpeed: data.wind.speed,
      visibility: (data.visibility / 1000).toFixed(1),
      sunrise: formatTime(data.sys.sunrise),
      sunset: formatTime(data.sys.sunset),
      description: data.weather[0].description,
      lat: data.coord.lat,
      lon: data.coord.lon,
    }

    try {
      const pollution = await fetchAirPollution(detail.value.lat, detail.value.lon)
      airQuality.value = pollution.main.aqi
    } catch (err) {
      console.error(err)
    }

    await nextTick()
    if (mapContainer.value) {
      const map = L.map(mapContainer.value).setView([detail.value.lat, detail.value.lon], 11)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map)
      L.marker([detail.value.lat, detail.value.lon]).addTo(map)
    }
  } catch (err) {
    detailError.value = '현재 날씨 정보를 불러오지 못했습니다. (.env의 API 키를 확인하세요)'
    console.error(err)
  }

  try {
    const forecastData = await fetchForecast(city.value.enName)
    forecastList.value = forecastData.list.slice(0, 24).map((entry) => ({
      date: entry.dt_txt.slice(0, 10),
      time: entry.dt_txt.slice(11, 16),
      temp: Math.round(entry.main.temp),
      description: entry.weather[0].description,
      pop: Math.round(entry.pop * 100),
    }))
  } catch (err) {
    detailError.value = '예보 정보를 불러오지 못했습니다. (.env의 API 키를 확인하세요)'
    console.error(err)
  }

  try {
    citySummary.value = await fetchCitySummary(city.value.name)
  } catch (err) {
    console.error(err)
  }
})

// 원본 데이터는 항상 섭씨. 화씨 선택 시 표시용으로만 변환
const displayTemp = computed(() => {
  const rawTemp = detail.value ? detail.value.temp : city.value.temp
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }
  return rawTemp
})

function toDisplayUnit(celsius) {
  if (configStore.unit === 'fahrenheit') {
    return Math.round((celsius * 9) / 5 + 32)
  }
  return celsius
}

const citySummaryParagraphs = computed(() => splitIntoParagraphs(citySummary.value))

// 날짜별로 묶어서 표시 (같은 날짜의 3시간 단위 예보를 한 그룹으로)
const groupedForecast = computed(() => {
  const groups = []
  forecastList.value.forEach((entry) => {
    let group = groups.find((g) => g.date === entry.date)
    if (!group) {
      group = { date: entry.date, label: formatDateLabel(entry.date), entries: [] }
      groups.push(group)
    }
    group.entries.push(entry)
  })
  return groups
})
</script>

<template>
  <div class="dashboard-wrapper">
    <div class="page-inner">
      <div v-if="city" class="detail-card">
        <h3>지역 상세 기상관측 정보</h3>
        <p class="city-title">
          <strong>{{ city.name }}</strong>
          <span class="status-text">{{ detail ? detail.description : city.status }}</span>
        </p>
        <p class="temp-large">
          {{ displayTemp }}{{ configStore.unitSymbol }}
          <Tag
            v-if="airQuality"
            :value="`대기질 ${aqiLabel[airQuality]}`"
            :severity="aqiSeverity[airQuality]"
            class="aqi-tag"
          />
        </p>

        <div v-if="detail" class="observation-grid">
          <div class="observation-item">
            <p class="observation-label">체감 온도</p>
            <p class="observation-value">
              {{ toDisplayUnit(detail.feelsLike) }}{{ configStore.unitSymbol }}
            </p>
          </div>
          <div class="observation-item">
            <p class="observation-label">최저 / 최고</p>
            <p class="observation-value">
              {{ toDisplayUnit(detail.tempMin) }}{{ configStore.unitSymbol }} /
              {{ toDisplayUnit(detail.tempMax) }}{{ configStore.unitSymbol }}
            </p>
          </div>
          <div class="observation-item">
            <p class="observation-label">습도</p>
            <p class="observation-value">{{ detail.humidity }}%</p>
          </div>
          <div class="observation-item">
            <p class="observation-label">기압</p>
            <p class="observation-value">{{ detail.pressure }}hPa</p>
          </div>
          <div class="observation-item">
            <p class="observation-label">풍속</p>
            <p class="observation-value">{{ detail.windSpeed }}m/s</p>
          </div>
          <div class="observation-item">
            <p class="observation-label">가시거리</p>
            <p class="observation-value">{{ detail.visibility }}km</p>
          </div>
          <div class="observation-item">
            <p class="observation-label">일출</p>
            <p class="observation-value">{{ detail.sunrise }}</p>
          </div>
          <div class="observation-item">
            <p class="observation-label">일몰</p>
            <p class="observation-value">{{ detail.sunset }}</p>
          </div>
        </div>
      </div>
      <div v-else class="detail-card">
        <p>해당 도시의 정보를 찾을 수 없습니다.</p>
      </div>

      <p v-if="detailError" class="load-error">{{ detailError }}</p>

      <div v-if="detail" class="detail-card">
        <h3>위치</h3>
        <div ref="mapContainer" class="map-container"></div>
      </div>

      <div v-if="citySummary" class="detail-card">
        <h3>도시 소개</h3>
        <p
          v-for="(paragraph, index) in citySummaryParagraphs"
          :key="index"
          class="summary-paragraph"
        >
          {{ paragraph }}
        </p>
      </div>

      <div v-if="groupedForecast.length > 0" class="detail-card">
        <h3>예보</h3>
        <div v-for="group in groupedForecast" :key="group.date" class="forecast-day">
          <p class="forecast-date">{{ group.label }}</p>
          <div v-for="entry in group.entries" :key="entry.time" class="forecast-row">
            <span class="forecast-time">{{ entry.time }}</span>
            <span class="forecast-desc">{{ entry.description }}</span>
            <span class="forecast-pop">강수확률 {{ entry.pop }}%</span>
            <span class="forecast-temp"
              >{{ toDisplayUnit(entry.temp) }}{{ configStore.unitSymbol }}</span
            >
          </div>
        </div>
      </div>

      <RouterLink to="/weather" class="back-link">메인 대시보드로 돌아가기</RouterLink>
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

.page-inner {
  max-width: 1000px;
  margin: 0 auto;
  padding: 60px 24px 100px;
}

.detail-card {
  padding: 24px;
  background: #f5f5f7;
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
}

.summary-paragraph {
  line-height: 1.6;
  margin-bottom: 14px;
}

.summary-paragraph:last-child {
  margin-bottom: 0;
}

.map-container {
  width: 100%;
  height: 280px;
  border-radius: 12px;
  overflow: hidden;
}

.status-text {
  color: #86868b;
}

.city-title {
  font-size: 1.1rem;
}

.temp-large {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 2.2rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin: 8px 0 20px;
}

.aqi-tag {
  font-size: 0.8rem;
}

.observation-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
  gap: 12px;
}

.observation-item {
  padding: 12px;
  background: #ffffff;
  border-radius: 12px;
  text-align: center;
}

.observation-label {
  font-size: 0.75rem;
  color: #86868b;
  margin-bottom: 4px;
}

.observation-value {
  font-size: 0.95rem;
  font-weight: 600;
}

.back-link {
  display: inline-block;
  padding: 8px 18px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #0071e3;
  border: 1.5px solid #0071e3;
  border-radius: 999px;
  text-decoration: none;
}

.back-link:hover {
  background: #e5f0ff;
}

.load-error {
  margin-bottom: 24px;
  padding: 12px 16px;
  font-size: 0.85rem;
  color: #d70015;
  background: #ffe5e5;
  border-radius: 12px;
}

.forecast-day {
  margin-bottom: 16px;
}

.forecast-day:last-child {
  margin-bottom: 0;
}

.forecast-date {
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 4px;
}

.forecast-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 4px;
  font-size: 0.85rem;
  border-bottom: 1px solid #ececee;
}

.forecast-row:last-child {
  border-bottom: none;
}

.forecast-time {
  width: 48px;
  color: #86868b;
  flex-shrink: 0;
}

.forecast-desc {
  flex: 1;
  color: #6e6e73;
}

.forecast-pop {
  width: 90px;
  color: #0071e3;
  font-size: 0.8rem;
  flex-shrink: 0;
}

.forecast-temp {
  width: 48px;
  font-weight: 600;
  text-align: right;
  flex-shrink: 0;
}
</style>
