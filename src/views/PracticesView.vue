<script setup>
import { ref, computed } from 'vue'
import BaseDashboardCard from '../components/exercise/BaseDashboardCard.vue'
import SampleOne from '../components/practices/basic/SampleOne.vue'
import SampleTwo from '../components/practices/basic/SampleTwo.vue'
import VueHTML from '../components/practices/basic/VueHtml.vue'
import Xss from '../components/practices/basic/Xss.vue'
import VueText from '../components/practices/basic/VueText.vue'
import VueBind from '../components/practices/basic/VueBind.vue'
import VueShow from '../components/practices/basic/VueShow.vue'
import VueFor from '../components/practices/basic/VueFor.vue'
import VueOn from '../components/practices/basic/VueOn.vue'
import VueIf from '../components/practices/basic/VueIf.vue'
import EventObject from '../components/practices/basic/EventObject.vue'
import EventModifier from '../components/practices/basic/EventModifier.vue'
import ClassBinding from '../components/practices/basic/ClassBind.vue'
import StyleBinding from '../components/practices/basic/StyleBind.vue'
import Ref from '../components/practices/basic/Ref.vue'
import Reactive from '../components/practices/basic/Reactive.vue'
import VueModel from '../components/practices/basic/VueModel.vue'
import VmodelModifiers from '../components/practices/basic/VmodelModifiers.vue'
import FormHandling from '../components/practices/basic/FormHandling.vue'
import VueStyle from '../components/practices/basic/VueStyle.vue'
import Computed from '../components/practices/basic/Computed.vue'
import Watch from '../components/practices/basic/Watch.vue'
import WatchEffect from '../components/practices/basic/WatchEffect.vue'
import MultiSourceWatch from '../components/practices/basic/MultiSourceWatch.vue'
import DeepWatch from '../components/practices/basic/DeepWatch.vue'
import LifecycleHook from '../components/practices/basic/LifecycleHook.vue'
import ProbsEmitsParent from '../components/practices/component/ProbsEmitsParent.vue'
import SlotDefaultParent from '../components/practices/component/SlotDefaultParent.vue'
import SlotNamedParent from '../components/practices/component/SlotNamedParent.vue'
import SlotScopeParent from '../components/practices/component/SlotScopeParent.vue'
import AxiosJson from '../components/practices/library/AxiosJson.vue'
import AxiosWeather from '../components/practices/library/AxiosWeather.vue'
import StoreCounter from '../components/practices/library/StoreCounter.vue'

const categories = [
  {
    title: '보간법 & 디렉티브',
    items: [
      { component: SampleOne, title: '기본 예제 1' },
      { component: SampleTwo, title: '기본 예제 2' },
      { component: VueHTML, title: 'v-html' },
      { component: Xss, title: 'XSS 위험성' },
      { component: VueText, title: 'v-text' },
      { component: VueBind, title: 'v-bind' },
      { component: VueShow, title: 'v-show' },
      { component: VueFor, title: 'v-for' },
      { component: VueIf, title: 'v-if' },
      { component: ClassBinding, title: 'class 바인딩' },
      { component: StyleBinding, title: 'style 바인딩' },
      { component: VueStyle, title: '스타일 종합' },
    ],
  },
  {
    title: '이벤트 & v-model',
    items: [
      { component: VueOn, title: 'v-on' },
      { component: EventObject, title: '이벤트 객체' },
      { component: EventModifier, title: '이벤트 수식어' },
      { component: VueModel, title: 'v-model' },
      { component: VmodelModifiers, title: 'v-model 수식어' },
      { component: FormHandling, title: '폼 처리' },
    ],
  },
  {
    title: 'Composition API',
    items: [
      { component: Ref, title: 'ref()' },
      { component: Reactive, title: 'reactive()' },
      { component: Computed, title: 'computed()' },
      { component: Watch, title: 'watch()' },
      { component: WatchEffect, title: 'watchEffect()' },
      { component: MultiSourceWatch, title: '다중 소스 watch' },
      { component: DeepWatch, title: 'deep watch' },
    ],
  },
  {
    title: '컴포넌트',
    items: [
      { component: ProbsEmitsParent, title: 'Props / Emits' },
      { component: SlotDefaultParent, title: '기본 슬롯' },
      { component: SlotNamedParent, title: 'Named 슬롯' },
      { component: SlotScopeParent, title: 'Scoped 슬롯' },
      { component: LifecycleHook, title: '라이프사이클 훅' },
    ],
  },
  {
    title: '외부 라이브러리',
    items: [
      { component: AxiosJson, title: 'Axios CRUD' },
      { component: AxiosWeather, title: 'Axios 날씨 통신' },
      { component: StoreCounter, title: 'Pinia Counter Store' },
    ],
  },
]

// ref에 객체를 그대로 담으면 내부적으로 reactive proxy로 바뀌어서 원본 객체와 참조 비교(===)가 깨진다.
// title(고유값)만 ref로 들고, 실제 항목/카테고리는 매번 찾아서 쓴다.
const selectedTitle = ref(categories[0].items[0].title)

const selected = computed(() => {
  for (const category of categories) {
    const item = category.items.find((item) => item.title === selectedTitle.value)
    if (item) return item
  }
  return null
})

// 지금 보고 있는 실습이 어느 유형(카테고리)에 속하는지 사이드바 밖에서도 알 수 있도록
const selectedCategory = computed(() => {
  return categories.find((category) => category.items.some((item) => item.title === selectedTitle.value))
})
</script>

<template>
  <div class="challenge-wrapper">
    <div class="page-inner">
      <section class="hero">
        <p class="hero-eyebrow">CODE CHALLENGE</p>
        <h2>Vue 실습 코드 모음</h2>
      </section>

      <div class="challenge-layout">
        <aside class="sidebar">
          <template v-for="category in categories" :key="category.title">
            <p class="sidebar-heading">{{ category.title }}</p>
            <button
              v-for="item in category.items"
              :key="item.title"
              class="sidebar-item"
              :class="{ active: selectedTitle === item.title }"
              @click="selectedTitle = item.title"
            >
              {{ item.title }}
            </button>
          </template>
        </aside>

        <main class="content-panel">
          <p v-if="selectedCategory" class="current-category">{{ selectedCategory.title }}</p>
          <BaseDashboardCard v-if="selected" class="practice-card">
            <template #title>
              <h3>{{ selected.title }}</h3>
            </template>
            <component :is="selected.component" />
          </BaseDashboardCard>
        </main>
      </div>
    </div>
  </div>
</template>

<style scoped>
.challenge-wrapper {
  width: 100%;
  background: var(--weather-bg);
  font-family:
    -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Apple SD Gothic Neo', 'Pretendard',
    sans-serif;
  color: var(--weather-text);
}

.page-inner {
  max-width: 1000px;
  margin: 0 auto;
  padding: var(--space-page-top) var(--space-page-x) var(--space-page-bottom);
}

.hero {
  padding: var(--space-hero-y) var(--space-hero-x);
  margin-bottom: 24px;
  border-radius: 24px;
  background: linear-gradient(135deg, var(--weather-primary) 0%, var(--weather-accent) 100%);
  color: var(--weather-surface);
}

.hero-eyebrow {
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  opacity: 0.85;
  margin-bottom: 8px;
}

.hero h2 {
  font-size: 1.8rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.challenge-layout {
  display: flex;
  align-items: flex-start;
  gap: 24px;
}

.sidebar {
  flex: 0 0 210px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  max-height: 75vh;
  overflow-y: auto;
  position: sticky;
  top: 24px;
  background: var(--weather-surface);
  border-radius: 16px;
  padding: 8px;
}

.sidebar-heading {
  margin: 14px 8px 4px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: var(--weather-text-muted);
}

.sidebar-heading:first-child {
  margin-top: 4px;
}

.sidebar-item {
  text-align: left;
  padding: 8px 12px;
  font-size: 0.85rem;
  color: var(--weather-text);
  background: none;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.sidebar-item:hover {
  background: var(--weather-neutral-soft);
}

.sidebar-item.active {
  background: var(--weather-primary-soft);
  color: var(--weather-primary);
  font-weight: 600;
}

.content-panel {
  flex: 1;
  min-width: 0;
}

.current-category {
  font-size: 1.4rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--weather-text);
  margin-bottom: 12px;
}

.practice-card {
  margin: 0;
}

.practice-card :deep(h3) {
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: -0.01em;
}

@media (max-width: 720px) {
  .challenge-layout {
    flex-direction: column;
  }

  .sidebar {
    flex: none;
    position: static;
    max-height: none;
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
  }

  .sidebar-heading {
    width: 100%;
  }
}
</style>
