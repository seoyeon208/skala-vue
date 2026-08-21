<script setup>
import Tag from 'primevue/tag'

defineProps({
  city: { type: Object, required: true },
})
</script>

<template>
  <div class="card-badges">
    <Tag
      :value="city.temp >= 30 ? '더움' : '선선함'"
      :severity="city.temp >= 30 ? 'danger' : 'secondary'"
    />
    <Tag
      :value="city.rainChance >= 30 ? '강수' : '맑음'"
      :severity="city.rainChance >= 30 ? 'info' : 'secondary'"
    />
  </div>
</template>

<style scoped>
.card-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
</style>
