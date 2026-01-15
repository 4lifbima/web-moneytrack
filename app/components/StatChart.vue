<template>
  <div class="bg-white rounded-2xl p-5 shadow-soft">
    <h3 class="font-semibold text-gray-900 mb-4">Monthly Overview</h3>
    
    <!-- Chart Bars -->
    <div class="flex items-end justify-between gap-2 h-40">
      <div 
        v-for="(stat, index) in stats" 
        :key="index"
        class="flex-1 flex flex-col items-center gap-2"
      >
        <!-- Bars Container -->
        <div class="w-full flex gap-1 items-end h-28">
          <!-- Income Bar -->
          <div 
            class="flex-1 bg-green-400 rounded-t-lg transition-all duration-500"
            :style="{ height: getBarHeight(stat.income, maxValue) }"
          />
          <!-- Expense Bar -->
          <div 
            class="flex-1 bg-red-400 rounded-t-lg transition-all duration-500"
            :style="{ height: getBarHeight(stat.expense, maxValue) }"
          />
        </div>
        
        <!-- Month Label -->
        <span class="text-xs text-gray-500 font-medium">{{ stat.month }}</span>
      </div>
    </div>

    <!-- Legend -->
    <div class="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-100">
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 bg-green-400 rounded-full" />
        <span class="text-sm text-gray-600">Income</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 bg-red-400 rounded-full" />
        <span class="text-sm text-gray-600">Expense</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface MonthlyStat {
  month: string
  year: number
  income: number
  expense: number
}

const props = defineProps<{
  stats: MonthlyStat[]
}>()

const maxValue = computed(() => {
  const allValues = props.stats.flatMap(s => [s.income, s.expense])
  return Math.max(...allValues, 1)
})

const getBarHeight = (value: number, max: number) => {
  const percentage = (value / max) * 100
  return `${Math.max(percentage, 2)}%`
}
</script>
