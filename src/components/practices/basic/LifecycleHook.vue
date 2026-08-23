<script setup>
import { ref, onMounted, onUpdated, onUnmounted } from 'vue'

const count = ref(0)
let timerId = null
console.log('1. [setup] 컴포넌트가 메모리가 생성되었습니다. (Dom 접근 불가능)')

onMounted(() => {
  console.log('2. [onMounted] 화면에 완벽히 부착되었습니다! (API 호출/DOM 조작 적기)')
  timerId = setInterval(() => {
    count.value++
  }, 3000)
})

onUpdated(() => {
  console.log(
    `3. [onUpdated] 데이터가 변경되어 화면을 새로 그렸습니다. (현재 count: ${count.value})`,
  )
})

onUnmounted(() => {
  clearInterval(timerId)
  console.log('4. [onUnmounted] 컴포넌트가 소멸했습니다. 타이머 청소 완료!')
})
</script>

<template>
  <div class="practice-section">
    <h2>생명주기 훅(Lifecycle Hooks) 학습</h2>
    <p>현재 count: {{ count }} (3초마다 자동 증가)</p>
    <small style="color: gray">각 단계는 브라우저 콘솔(F12)에서 확인하세요.</small>
  </div>
</template>
