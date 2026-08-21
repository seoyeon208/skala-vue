<script setup>
import SelectButton from 'primevue/selectbutton'
import { useConfigStore } from '../../stores/configStore.js'

const configStore = useConfigStore()

const unitOptions = [
  { label: '섭씨(°C)', value: 'celsius' },
  { label: '화씨(°F)', value: 'fahrenheit' },
]
</script>

<template>
  <div class="unit-toggler">
    <span>날씨단위:</span>
    <SelectButton
      :model-value="configStore.unit"
      :options="unitOptions"
      option-label="label"
      option-value="value"
      :allow-empty="false"
      @update:model-value="configStore.toggleUnit()"
    />
  </div>
</template>

<style scoped>
.unit-toggler {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: #6e6e73;
}
</style>
