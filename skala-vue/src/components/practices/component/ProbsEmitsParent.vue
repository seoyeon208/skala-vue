<script setup>
import { ref } from 'vue'
import ProbsEmitsChild from './ProbsEmitsChild.vue'

const message = ref('초기 데이터')

const handleUpdateRequest = (newValue) => {
  message.value = newValue
}
</script>

<template>
  <div class="practice-section">
    <h2>Probs & Emits</h2>
    <div class="parent-container">
      <h2>상위 컴포넌트 (Parent)</h2>
      <p>
        현재 로컬 데이터(State): <strong>{{ message }}</strong>
      </p>
      <br />
      <ProbsEmitsChild :parent-data="message" @update-request="handleUpdateRequest" />
    </div>
  </div>
</template>
