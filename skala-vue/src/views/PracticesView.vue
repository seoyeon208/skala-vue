<script setup>
import BaseDashboardCard from '../components/exercise/BaseDashboardCard.vue'
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'
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
</script>

<template>
  <div class="challenge-wrapper">
    <div class="page-inner">
      <section class="hero">
        <p class="hero-eyebrow">CODE CHALLENGE</p>
        <h2>Vue 실습 코드 모음</h2>
      </section>

      <Tabs value="0">
        <TabList>
          <Tab v-for="(category, index) in categories" :key="category.title" :value="String(index)">
            {{ category.title }}
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel v-for="(category, index) in categories" :key="category.title" :value="String(index)">
            <BaseDashboardCard v-for="item in category.items" :key="item.title" class="practice-card">
              <template #title>
                <h3>{{ item.title }}</h3>
              </template>
              <component :is="item.component" />
            </BaseDashboardCard>
          </TabPanel>
        </TabPanels>
      </Tabs>
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
  padding: 60px 24px 100px;
}

.hero {
  padding: 40px 32px;
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

.practice-card {
  margin-top: 24px;
}

.practice-card :deep(h3) {
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: -0.01em;
}
</style>
