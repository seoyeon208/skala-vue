// 가상의 백엔드 데이터 배열 (WeatherHomeView, WeatherDetailView가 공유)
// enName: OpenWeatherMap 조회용 영문 도시명. temp/status/rainChance는 API 로딩 전 초기값(fallback)
export const weatherList = [
  { id: 'city_01', name: '서울', enName: 'Seoul', temp: 28, status: '맑음', rainChance: 10 },
  { id: 'city_02', name: '수원', enName: 'Suwon', temp: 24, status: '비', rainChance: 80 },
  { id: 'city_03', name: '부산', enName: 'Busan', temp: 26, status: '구름', rainChance: 40 },
  { id: 'city_04', name: '대구', enName: 'Daegu', temp: 33, status: '맑음', rainChance: 5 },
  { id: 'city_05', name: '인천', enName: 'Incheon', temp: 22, status: '맑음', rainChance: 15 },
  { id: 'city_06', name: '제주', enName: 'Jeju', temp: 8, status: '눈', rainChance: 20 },
  { id: 'city_07', name: '강릉', enName: 'Gangneung', temp: 15, status: '맑음', rainChance: 25 },
  { id: 'city_08', name: '광주', enName: 'Gwangju', temp: 27, status: '맑음', rainChance: 20 },
  { id: 'city_09', name: '대전', enName: 'Daejeon', temp: 25, status: '구름', rainChance: 30 },
  { id: 'city_10', name: '울산', enName: 'Ulsan', temp: 26, status: '맑음', rainChance: 15 },
  { id: 'city_11', name: '전주', enName: 'Jeonju', temp: 24, status: '맑음', rainChance: 20 },
  { id: 'city_12', name: '청주', enName: 'Cheongju', temp: 23, status: '구름', rainChance: 35 },
  { id: 'city_13', name: '포항', enName: 'Pohang', temp: 27, status: '맑음', rainChance: 10 },
  { id: 'city_14', name: '여수', enName: 'Yeosu', temp: 25, status: '맑음', rainChance: 20 },
  { id: 'city_15', name: '춘천', enName: 'Chuncheon', temp: 20, status: '구름', rainChance: 40 },
  { id: 'city_16', name: '창원', enName: 'Changwon', temp: 27, status: '맑음', rainChance: 15 },
  { id: 'city_17', name: '목포', enName: 'Mokpo', temp: 24, status: '비', rainChance: 60 },
]
