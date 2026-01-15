<template>
  <div class="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-5 text-white shadow-card">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <div>
        <p class="text-primary-100 text-sm font-medium">Total Balance</p>
        <h2 class="text-3xl font-bold mt-1">
          {{ formatCurrency(balance) }}
        </h2>
      </div>
      <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
        <PhWallet :size="24" weight="fill" />
      </div>
    </div>

    <!-- Income & Expense Summary -->
    <div class="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/20">
      <!-- Income -->
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-green-400/20 rounded-xl flex items-center justify-center">
          <PhArrowDown :size="20" weight="bold" class="text-green-300" />
        </div>
        <div>
          <p class="text-primary-100 text-xs">Income</p>
          <p class="text-white font-semibold">{{ formatCurrency(income) }}</p>
        </div>
      </div>

      <!-- Expense -->
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-red-400/20 rounded-xl flex items-center justify-center">
          <PhArrowUp :size="20" weight="bold" class="text-red-300" />
        </div>
        <div>
          <p class="text-primary-100 text-xs">Expense</p>
          <p class="text-white font-semibold">{{ formatCurrency(expense) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PhWallet, PhArrowDown, PhArrowUp } from '@phosphor-icons/vue'

defineProps<{
  balance: number
  income: number
  expense: number
}>()

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}
</script>
