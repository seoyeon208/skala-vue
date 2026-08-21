<script setup>
import InputText from 'primevue/inputtext'
import Chip from 'primevue/chip'
import { useSearchHistoryStore } from '../../stores/searchHistoryStore.js'

defineProps({
  searchQuery: { type: String, required: true },
})

const emit = defineEmits(['update-query'])

const searchHistoryStore = useSearchHistoryStore()

const handleEnter = (e) => {
  searchHistoryStore.addSearch(e.target.value)
}

const selectHistory = (term) => {
  emit('update-query', term)
}
</script>

<template>
  <InputText
    :model-value="searchQuery"
    fluid
    placeholder="검색할 도시 이름 입력을 마치면 Enter"
    @update:model-value="emit('update-query', $event)"
    @keyup.enter="handleEnter"
  />
  <p>
    검색 중인 도시: <strong>{{ searchQuery }}</strong>
  </p>

  <div v-if="searchHistoryStore.recentSearches.length > 0" class="history">
    <span class="history-label">최근 검색:</span>
    <Chip
      v-for="term in searchHistoryStore.recentSearches"
      :key="term"
      :label="term"
      class="history-chip"
      @click="selectHistory(term)"
    />
  </div>
</template>

<style scoped>
p {
  margin-top: 10px;
  font-size: 0.9rem;
  color: #86868b;
}

.history {
  margin-top: 10px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
}

.history-label {
  font-size: 0.8rem;
  color: #86868b;
}

.history-chip {
  cursor: pointer;
}
</style>
