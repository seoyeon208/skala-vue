import axios from 'axios'

// Wikipedia REST API - 키 발급 불필요
export async function fetchCitySummary(cityNameKo) {
  const response = await axios.get(
    `https://ko.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cityNameKo)}`,
  )
  return response.data.extract
}
