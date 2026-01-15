<template>
  <div class="px-4 py-6">
    <!-- Header -->
    <header class="mb-6">
      <p class="text-gray-500 text-sm">Welcome back 👋</p>
      <h1 class="text-2xl font-bold text-gray-900 mt-1">{{ user?.name || 'User' }}</h1>
    </header>

    <!-- Balance Card -->
    <BalanceCard 
      v-if="stats"
      :balance="stats.total.balance"
      :income="stats.currentMonth.income"
      :expense="stats.currentMonth.expense"
    />
    
    <!-- Loading State for Balance -->
    <div v-else class="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-5 h-40 animate-pulse" />

    <!-- Quick Stats -->
    <div class="mt-6 grid grid-cols-2 gap-4">
      <div class="bg-white rounded-xl p-4 shadow-soft">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
            <PhCalendarBlank :size="20" class="text-primary-600" />
          </div>
          <div>
            <p class="text-xs text-gray-500">This Month</p>
            <p class="font-semibold text-gray-900">{{ stats?.currentMonth.month || '...' }}</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl p-4 shadow-soft">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <PhReceipt :size="20" class="text-blue-600" />
          </div>
          <div>
            <p class="text-xs text-gray-500">Transactions</p>
            <p class="font-semibold text-gray-900">{{ transactions?.length || 0 }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Transactions -->
    <section class="mt-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="font-bold text-gray-900">Recent Transactions</h2>
        <NuxtLink to="/transactions" class="text-primary-500 text-sm font-medium">
          See All
        </NuxtLink>
      </div>

      <!-- Transaction List -->
      <div v-if="transactions && transactions.length > 0" class="space-y-3">
        <TransactionItem 
          v-for="transaction in transactions.slice(0, 5)"
          :key="transaction.id"
          :transaction="transaction"
        />
      </div>

      <!-- Empty State -->
      <div v-else-if="transactions && transactions.length === 0" class="text-center py-12">
        <div class="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <PhReceipt :size="32" class="text-gray-400" />
        </div>
        <p class="text-gray-500 mb-4">No transactions yet</p>
        <NuxtLink 
          to="/add" 
          class="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-xl font-medium"
        >
          <PhPlus :size="20" />
          Add Transaction
        </NuxtLink>
      </div>

      <!-- Loading State -->
      <div v-else class="space-y-3">
        <div v-for="i in 3" :key="i" class="bg-white rounded-xl p-4 h-20 animate-pulse" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { PhCalendarBlank, PhReceipt, PhPlus } from '@phosphor-icons/vue'

interface Transaction {
  id: number
  amount: number
  type: string
  category: string
  note: string | null
  createdAt: string
}

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
}

const { user } = useAuth()
const { data: transactions } = useFetch<Transaction[]>('/api/transactions')
const { data: stats } = useFetch<Stats>('/api/stats')
</script>
