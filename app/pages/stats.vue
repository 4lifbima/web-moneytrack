<template>
  <div class="px-4 py-6">
    <!-- Header -->
    <header class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Statistics</h1>
      <p class="text-gray-500 text-sm mt-1">Your financial overview</p>
    </header>

    <!-- Summary Cards -->
    <div class="grid grid-cols-2 gap-4 mb-6">
      <!-- Total Income -->
      <div class="bg-white rounded-2xl p-4 shadow-soft">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
            <PhArrowDown :size="20" class="text-green-600" weight="bold" />
          </div>
          <span class="text-sm font-medium text-gray-500">Total Income</span>
        </div>
        <p class="text-xl font-bold text-green-600">
          {{ stats ? formatCurrency(stats.total.income) : '...' }}
        </p>
      </div>

      <!-- Total Expense -->
      <div class="bg-white rounded-2xl p-4 shadow-soft">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
            <PhArrowUp :size="20" class="text-red-600" weight="bold" />
          </div>
          <span class="text-sm font-medium text-gray-500">Total Expense</span>
        </div>
        <p class="text-xl font-bold text-red-600">
          {{ stats ? formatCurrency(stats.total.expense) : '...' }}
        </p>
      </div>
    </div>

    <!-- Net Savings -->
    <div class="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-5 mb-6 text-white shadow-card">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-primary-100 text-sm">Net Savings</p>
          <p class="text-3xl font-bold mt-1">
            {{ stats ? formatCurrency(stats.total.balance) : '...' }}
          </p>
        </div>
        <div class="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
          <PhPiggyBank :size="28" weight="fill" />
        </div>
      </div>
    </div>

    <!-- Monthly Chart -->
    <StatChart v-if="stats && stats.monthlyStats" :stats="stats.monthlyStats" />
    <div v-else class="bg-white rounded-2xl p-5 h-64 animate-pulse" />

    <!-- This Month Breakdown -->
    <div v-if="stats" class="mt-6 bg-white rounded-2xl p-5 shadow-soft">
      <h3 class="font-semibold text-gray-900 mb-4">{{ stats.currentMonth.month }}</h3>
      
      <div class="space-y-4">
        <!-- Income Progress -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-gray-600">Income</span>
            <span class="text-sm font-semibold text-green-600">{{ formatCurrency(stats.currentMonth.income) }}</span>
          </div>
          <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              class="h-full bg-green-500 rounded-full transition-all duration-500"
              :style="{ width: getProgressWidth(stats.currentMonth.income) }"
            />
          </div>
        </div>

        <!-- Expense Progress -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-gray-600">Expense</span>
            <span class="text-sm font-semibold text-red-600">{{ formatCurrency(stats.currentMonth.expense) }}</span>
          </div>
          <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              class="h-full bg-red-500 rounded-full transition-all duration-500"
              :style="{ width: getProgressWidth(stats.currentMonth.expense) }"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PhArrowDown, PhArrowUp, PhPiggyBank } from '@phosphor-icons/vue'

interface Stats {
  currentMonth: {
    income: number
    expense: number
    balance: number
    month: string
  }
  total: {
    income: number
    expense: number
    balance: number
  }
  monthlyStats: Array<{
    month: string
    year: number
    income: number
    expense: number
  }>
}

const { data: stats } = useFetch<Stats>('/api/stats')

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

const getProgressWidth = (value: number) => {
  if (!stats.value) return '0%'
  const max = Math.max(stats.value.currentMonth.income, stats.value.currentMonth.expense, 1)
  return `${Math.round((value / max) * 100)}%`
}
</script>
