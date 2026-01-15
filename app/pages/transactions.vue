<template>
  <div class="px-4 py-6">
    <!-- Header -->
    <header class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Transactions</h1>
      <p class="text-gray-500 text-sm mt-1">All your transaction history</p>
    </header>

    <!-- Filter Tabs -->
    <div class="flex gap-2 mb-6">
      <button
        v-for="filter in filters"
        :key="filter.value"
        @click="activeFilter = filter.value"
        class="px-4 py-2 rounded-xl text-sm font-medium transition-colors"
        :class="activeFilter === filter.value 
          ? 'bg-primary-500 text-white' 
          : 'bg-white text-gray-600 shadow-soft'"
      >
        {{ filter.label }}
      </button>
    </div>

    <!-- Transaction List -->
    <div v-if="filteredTransactions && filteredTransactions.length > 0" class="space-y-3">
      <TransactionItem 
        v-for="transaction in filteredTransactions"
        :key="transaction.id"
        :transaction="transaction"
        @click="openDeleteModal(transaction)"
      />
    </div>

    <!-- Empty State -->
    <div v-else-if="transactions && filteredTransactions?.length === 0" class="text-center py-16">
      <div class="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <PhReceipt :size="40" class="text-gray-400" />
      </div>
      <h3 class="font-semibold text-gray-900 mb-2">No transactions found</h3>
      <p class="text-gray-500 text-sm mb-6">
        {{ activeFilter === 'all' ? 'Start tracking your money!' : `No ${activeFilter} transactions` }}
      </p>
      <NuxtLink 
        to="/add" 
        class="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-xl font-medium shadow-lg shadow-primary-500/30"
      >
        <PhPlus :size="20" weight="bold" />
        Add Transaction
      </NuxtLink>
    </div>

    <!-- Loading State -->
    <div v-else class="space-y-3">
      <div v-for="i in 5" :key="i" class="bg-white rounded-xl p-4 h-20 animate-pulse" />
    </div>

    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <div 
        v-if="showDeleteModal" 
        class="fixed inset-0 bg-black/50 flex items-end justify-center z-50 p-4"
        @click.self="showDeleteModal = false"
      >
        <div class="bg-white rounded-2xl w-full max-w-md p-6 animate-slide-up">
          <h3 class="text-lg font-bold text-gray-900 mb-2">Delete Transaction?</h3>
          <p class="text-gray-500 text-sm mb-6">
            Are you sure you want to delete this transaction? This action cannot be undone.
          </p>
          <div class="flex gap-3">
            <button
              @click="showDeleteModal = false"
              class="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium"
            >
              Cancel
            </button>
            <button
              @click="deleteTransaction"
              :disabled="isDeleting"
              class="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl font-medium disabled:opacity-50"
            >
              {{ isDeleting ? 'Deleting...' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { PhReceipt, PhPlus } from '@phosphor-icons/vue'

interface Transaction {
  id: number
  amount: number
  type: string
  category: string
  note: string | null
  createdAt: string
}

const { data: transactions, refresh } = useFetch<Transaction[]>('/api/transactions')

const filters = [
  { label: 'All', value: 'all' },
  { label: 'Income', value: 'income' },
  { label: 'Expense', value: 'expense' },
]

const activeFilter = ref('all')
const showDeleteModal = ref(false)
const selectedTransaction = ref<Transaction | null>(null)
const isDeleting = ref(false)

const filteredTransactions = computed(() => {
  if (!transactions.value) return null
  if (activeFilter.value === 'all') return transactions.value
  return transactions.value.filter(t => t.type === activeFilter.value)
})

const openDeleteModal = (transaction: Transaction) => {
  selectedTransaction.value = transaction
  showDeleteModal.value = true
}

const deleteTransaction = async () => {
  if (!selectedTransaction.value) return
  
  isDeleting.value = true
  try {
    await $fetch(`/api/transactions/${selectedTransaction.value.id}`, {
      method: 'DELETE',
    })
    await refresh()
    showDeleteModal.value = false
  } catch (error) {
    console.error('Failed to delete transaction:', error)
  } finally {
    isDeleting.value = false
  }
}
</script>

<style scoped>
@keyframes slide-up {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-slide-up {
  animation: slide-up 0.3s ease-out;
}
</style>
