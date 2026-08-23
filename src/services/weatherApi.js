import axios from 'axios'

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const BASE_URL = 'https://api.openweathermap.org/data/2.5'

export const WEATHER_LOAD_ERROR =
  '실시간 날씨를 불러오지 못했습니다. (.env의 API 키를 확인하세요 — mock 데이터로 표시 중)'

export async function fetchCurrentWeather(cityNameEn) {
  const response = await axios.get(`${BASE_URL}/weather`, {
    params: { q: `${cityNameEn},KR`, appid: API_KEY, units: 'metric', lang: 'kr' },
  })
  return response.data
}

// 5일/3시간 단위 예보 - 실제 강수확률(pop) 포함
export async function fetchForecast(cityNameEn) {
  const response = await axios.get(`${BASE_URL}/forecast`, {
    params: { q: `${cityNameEn},KR`, appid: API_KEY, units: 'metric', lang: 'kr' },
  })
  return response.data
}

// 대기질(AQI) - 별도 지오코딩 없이 fetchCurrentWeather 응답의 coord 재사용
export async function fetchAirPollution(lat, lon) {
  const response = await axios.get(`${BASE_URL}/air_pollution`, {
    params: { lat, lon, appid: API_KEY },
  })
  return response.data.list[0]
}
