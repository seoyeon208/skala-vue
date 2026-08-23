<script setup>
import Card from 'primevue/card'
</script>

<template>
  <Card class="dashboard-card">
    <template #title><slot name="title"></slot></template>
    <template #content><slot></slot></template>
  </Card>
</template>

<style scoped>
.dashboard-card {
  margin-bottom: 24px;
}
</style>
