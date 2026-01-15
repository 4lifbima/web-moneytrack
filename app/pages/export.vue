<template>
  <div class="px-4 py-6 max-w-lg mx-auto">
    <!-- Header -->
    <header class="flex items-center gap-4 mb-6">
      <button 
        @click="navigateTo('/profile')" 
        class="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-soft"
      >
        <PhCaretLeft :size="20" class="text-gray-600" />
      </button>
      <div>
        <h1 class="text-xl font-bold text-gray-900">Export Data</h1>
        <p class="text-gray-500 text-sm">Download your transactions</p>
      </div>
    </header>

    <!-- Export Options -->
    <div class="space-y-4">
      <!-- Info Card -->
      <div class="bg-blue-50 border border-blue-200 rounded-2xl p-4">
        <div class="flex items-start gap-3">
          <PhInfo :size="20" class="text-blue-500 flex-shrink-0 mt-0.5" />
          <p class="text-blue-700 text-sm">
            Export all your transactions to a CSV file that you can open in Excel, Google Sheets, or any spreadsheet application.
          </p>
        </div>
      </div>

      <!-- Export Stats -->
      <div class="bg-white rounded-2xl p-5 shadow-soft">
        <h3 class="font-semibold text-gray-900 mb-4">Export Summary</h3>
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-gray-600 text-sm">Total Transactions</span>
            <span class="font-semibold text-gray-900">{{ stats?.transactionCount || 0 }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-gray-600 text-sm">Total Income</span>
            <span class="font-semibold text-green-600">{{ formatCurrency(stats?.totalIncome || 0) }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-gray-600 text-sm">Total Expense</span>
            <span class="font-semibold text-red-600">{{ formatCurrency(stats?.totalExpense || 0) }}</span>
          </div>
        </div>
      </div>

      <!-- Export Format -->
      <div class="bg-white rounded-2xl p-5 shadow-soft">
        <h3 class="font-semibold text-gray-900 mb-3">Export Format</h3>
        <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
          <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <PhFileText :size="20" class="text-green-600" />
          </div>
          <div>
            <p class="font-medium text-gray-900">CSV File</p>
            <p class="text-xs text-gray-500">Comma Separated Values</p>
          </div>
        </div>
      </div>

      <!-- Export Button -->
      <button
        @click="handleExport"
        :disabled="isExporting || !stats?.transactionCount"
        class="w-full flex items-center justify-center gap-3 py-4 bg-primary-500 text-white rounded-2xl font-bold shadow-lg shadow-primary-500/30 disabled:opacity-50 transition-all active:scale-[0.98]"
      >
        <PhDownload :size="20" weight="bold" />
        {{ isExporting ? 'Exporting...' : 'Download CSV' }}
      </button>

      <p v-if="!stats?.transactionCount" class="text-center text-gray-400 text-sm">
        No transactions to export
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PhCaretLeft, PhInfo, PhFileText, PhDownload } from '@phosphor-icons/vue'

interface Stats {
  total: {
    income: number
    expense: number
  }
}

const { data: statsData } = useFetch<Stats>('/api/stats')
const { data: transactions } = useFetch<any[]>('/api/transactions')

const isExporting = ref(false)

const stats = computed(() => {
  if (!statsData.value || !transactions.value) return null
  return {
    transactionCount: transactions.value.length,
    totalIncome: statsData.value.total.income,
    totalExpense: statsData.value.total.expense,
  }
})

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

const handleExport = async () => {
  isExporting.value = true
  try {
    // Trigger download
    window.location.href = '/api/export'
  } finally {
    setTimeout(() => {
      isExporting.value = false
    }, 1000)
  }
}
</script>
