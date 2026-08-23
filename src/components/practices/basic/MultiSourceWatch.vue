<script setup>
import { ref, watch } from 'vue'
const city = ref('서울')
const dateType = ref('오늘')
const apiStatus = ref('대기중...')

watch([city, dateType], ([newCity, newDate], [oldCity, oldDate]) => {
  apiStatus.value = `[변경 감지] ${oldCity}(${oldDate})에서 ${newCity}(${newDate})`
  console.log(`[통합 API 호출] ${newCity}의 ${newDate} 날씨를 불러옵니다...`)
})
</script>

<template>
  <div class="practice-section">
    <h2>다중 감시자 watch()의 활용</h2>
    <h3>지역 선택 제어판</h3>
    <p>현재 선택된 도시: {{ city }}</p>
    <p>날짜 유형: {{ dateType }}</p>
    <button @click="city = '서울'">서울 선택</button>
    <button @click="city = '수원'">수원 선택</button>
    <button @click="city = '부산'">부산 선택</button>
    <button @click="dateType = '오늘'">오늘 선택</button>
    <button @click="dateType = '내일'">내일 선택</button>
    <div class="monitor">
      <h3>통합 감시자(watch) 모니터링 시스템</h3>
      <p>{{ apiStatus }}</p>
      <small style="color: gray">(버튼을 누른 후 브라우저 콘솔창 F12를 확인해 보세요)</small>
    </div>
  </div>
</template>
