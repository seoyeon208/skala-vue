<script setup>
import { computed } from 'vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import WeatherBadge from './WeatherBadge.vue'
import { useConfigStore } from '../../stores/configStore.js'
import { useFavoriteStore } from '../../stores/favoriteStore.js'

const props = defineProps({
  city: { type: Object, required: true },
})

const emit = defineEmits(['select-card', 'click-detail'])

const configStore = useConfigStore()
const favoriteStore = useFavoriteStore()

// 원본 데이터는 항상 섭씨. 화씨 선택 시 표시용으로만 변환 (더움/추움 판정은 원본 섭씨 기준 그대로)
const displayTemp = computed(() => {
  const rawTemp = props.city.temp
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }
  return rawTemp
})
</script>

<template>
  <Card class="weather-card" @click="emit('select-card', city)">
    <template #content>
      <div class="card-body">
        <Button
          class="btn-favorite"
          :class="{ active: favoriteStore.isFavorite(city.id) }"
          text
          rounded
          :icon="favoriteStore.isFavorite(city.id) ? 'pi pi-star-fill' : 'pi pi-star'"
          @click.stop="favoriteStore.toggleFavorite(city.id)"
        />

        <div class="card-info">
          <h4>
            {{ city.name }} <span class="status-text">{{ city.status }}</span>
          </h4>
          <div class="temp-row">
            <img
              v-if="city.icon"
              class="weather-icon"
              :src="`https://openweathermap.org/img/wn/${city.icon}@2x.png`"
              :alt="city.status"
            />
            <p class="temp">{{ displayTemp }}{{ configStore.unitSymbol }}</p>
          </div>
          <p class="rain">강수확률 {{ city.rainChance }}%</p>
        </div>

        <WeatherBadge :city="city" />

        <Button
          label="상세보기"
          outlined
          rounded
          class="btn-detail"
          @click.stop="emit('click-detail', city)"
        />
      </div>
    </template>
  </Card>
</template>

<style scoped>
.weather-card {
  position: relative;
  cursor: pointer;
  transition:
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.weather-card:hover {
  transform: translateY(-1px);
}

.card-body {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;
}

.btn-favorite {
  position: absolute;
  top: 16px;
  right: 16px;
  color: var(--weather-border);
}

.btn-favorite.active {
  color: var(--weather-favorite);
}

.card-info {
  flex: 1;
  min-width: 0;
}

.card-info h4 {
  font-size: 1.05rem;
  font-weight: 600;
  margin-bottom: 4px;
}

.status-text {
  font-weight: 400;
  color: var(--weather-text-muted);
}

.temp-row {
  display: flex;
  align-items: center;
  gap: 4px;
}

.weather-icon {
  width: 40px;
  height: 40px;
  margin-left: -8px;
}

.card-info .temp {
  font-size: 1.4rem;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.card-info .rain {
  font-size: 0.85rem;
  color: var(--weather-text-muted);
}

.btn-detail {
  align-self: stretch;
}
</style>
