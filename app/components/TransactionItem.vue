<template>
  <NuxtLink 
    :to="`/transaction/${transaction.id}`"
    class="flex items-center gap-4 p-4 bg-white rounded-xl shadow-soft transition-all active:scale-[0.98] hover:shadow-md"
  >
    <!-- Category Icon -->
    <div 
      class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
      :class="transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'"
    >
      <component 
        :is="getCategoryIcon(transaction.category)" 
        :size="24" 
        :class="transaction.type === 'income' ? 'text-green-600' : 'text-red-600'"
      />
    </div>

    <!-- Transaction Details -->
    <div class="flex-1 min-w-0">
      <h4 class="font-semibold text-gray-900 truncate">{{ transaction.category }}</h4>
      <p class="text-sm text-gray-500 truncate">{{ transaction.note || 'No note' }}</p>
    </div>

    <!-- Amount & Date -->
    <div class="text-right flex-shrink-0">
      <p 
        class="font-bold"
        :class="transaction.type === 'income' ? 'text-green-600' : 'text-red-600'"
      >
        {{ transaction.type === 'income' ? '+' : '-' }}{{ formatCurrency(transaction.amount) }}
      </p>
      <p class="text-xs text-gray-400 mt-1">{{ formatDate(transaction.createdAt) }}</p>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { 
  PhMoney, PhLaptop, PhChartLineUp, PhGift, PhDotsThreeCircle,
  PhHamburger, PhCar, PhShoppingBag, PhReceipt, PhGameController,
  PhFirstAidKit, PhGraduationCap
} from '@phosphor-icons/vue'

interface Transaction {
  id: number
  amount: number
  type: string
  category: string
  note: string | null
  createdAt: string
}

defineProps<{
  transaction: Transaction
}>()

const categoryIcons: Record<string, any> = {
  'Salary': PhMoney,
  'Freelance': PhLaptop,
  'Investment': PhChartLineUp,
  'Gift': PhGift,
  'Food': PhHamburger,
  'Transport': PhCar,
  'Shopping': PhShoppingBag,
  'Bills': PhReceipt,
  'Entertainment': PhGameController,
  'Health': PhFirstAidKit,
  'Education': PhGraduationCap,
  'Other': PhDotsThreeCircle,
}

const getCategoryIcon = (category: string) => {
  return categoryIcons[category] || PhDotsThreeCircle
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
  })
}
</script>
