<template>
  <div class="px-4 py-6 max-w-lg mx-auto overflow-x-hidden">
    <!-- Header with Back Button -->
    <header class="flex items-center gap-4 mb-6">
      <button 
        @click="navigateTo('/')" 
        class="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-soft flex-shrink-0"
      >
        <PhCaretLeft :size="20" class="text-gray-600" />
      </button>
      <div class="min-w-0">
        <h1 class="text-xl font-bold text-gray-900">Add Transaction</h1>
        <p class="text-gray-500 text-sm truncate">Track your income or expense</p>
      </div>
    </header>

    <form @submit.prevent="submitTransaction" class="space-y-5">
      <!-- Amount Input -->
      <div class="bg-white rounded-2xl p-5 shadow-soft">
        <label class="text-sm font-medium text-gray-500 mb-2 block">Amount</label>
        <div class="flex items-center gap-2">
          <span class="text-xl font-bold text-gray-400">Rp</span>
          <input
            v-model.number="form.amount"
            type="number"
            placeholder="0"
            required
            min="1"
            class="flex-1 text-2xl font-bold text-gray-900 bg-transparent outline-none w-full min-w-0"
          />
        </div>
      </div>

      <!-- Type Selector -->
      <div class="bg-white rounded-2xl p-4 shadow-soft">
        <label class="text-sm font-medium text-gray-500 mb-3 block">Type</label>
        <div class="grid grid-cols-2 gap-2">
          <button
            type="button"
            @click="form.type = 'income'"
            class="flex items-center justify-center gap-2 px-3 py-3 rounded-xl font-medium transition-all text-sm"
            :class="form.type === 'income' 
              ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' 
              : 'bg-gray-100 text-gray-600'"
          >
            <PhArrowDown :size="18" weight="bold" />
            Income
          </button>
          <button
            type="button"
            @click="form.type = 'expense'"
            class="flex items-center justify-center gap-2 px-3 py-3 rounded-xl font-medium transition-all text-sm"
            :class="form.type === 'expense' 
              ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' 
              : 'bg-gray-100 text-gray-600'"
          >
            <PhArrowUp :size="18" weight="bold" />
            Expense
          </button>
        </div>
      </div>

      <!-- Category Selector -->
      <div class="bg-white rounded-2xl p-4 shadow-soft">
        <label class="text-sm font-medium text-gray-500 mb-3 block">Category</label>
        <div v-if="filteredCategories && filteredCategories.length > 0" class="grid grid-cols-4 gap-2">
          <button
            v-for="category in filteredCategories"
            :key="category.id"
            type="button"
            @click="form.category = category.name"
            class="flex flex-col items-center gap-1 p-2 rounded-xl transition-all"
            :class="form.category === category.name 
              ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30' 
              : 'bg-gray-50 text-gray-600'"
          >
            <component 
              :is="getCategoryIcon(category.name)" 
              :size="20" 
            />
            <span class="text-[10px] font-medium truncate w-full text-center leading-tight">{{ category.name }}</span>
          </button>
        </div>
        <div v-else class="grid grid-cols-4 gap-2">
          <div v-for="i in 8" :key="i" class="h-16 bg-gray-100 rounded-xl animate-pulse" />
        </div>
      </div>

      <!-- Note Input -->
      <div class="bg-white rounded-2xl p-4 shadow-soft">
        <label class="text-sm font-medium text-gray-500 mb-2 block">Note (Optional)</label>
        <input
          v-model="form.note"
          type="text"
          placeholder="Add a note..."
          class="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary-500/20 transition-all text-sm"
        />
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="isSubmitting || !form.amount || !form.category"
        class="w-full py-4 bg-primary-500 text-white rounded-2xl font-bold text-base shadow-lg shadow-primary-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
      >
        {{ isSubmitting ? 'Saving...' : 'Save Transaction' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { 
  PhCaretLeft, PhArrowDown, PhArrowUp,
  PhMoney, PhLaptop, PhChartLineUp, PhGift, PhDotsThreeCircle,
  PhHamburger, PhCar, PhShoppingBag, PhReceipt, PhGameController,
  PhFirstAidKit, PhGraduationCap
} from '@phosphor-icons/vue'

interface Category {
  id: number
  name: string
  icon: string
  type: string
}

const { data: categories } = useFetch<Category[]>('/api/categories')

const form = reactive({
  amount: null as number | null,
  type: 'expense' as 'income' | 'expense',
  category: '',
  note: '',
})

const isSubmitting = ref(false)

const filteredCategories = computed(() => {
  if (!categories.value) return null
  return categories.value.filter(c => c.type === form.type)
})

// Reset category when type changes
watch(() => form.type, () => {
  form.category = ''
})

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

const submitTransaction = async () => {
  if (!form.amount || !form.category) return

  isSubmitting.value = true
  try {
    await $fetch('/api/transactions', {
      method: 'POST',
      body: {
        amount: form.amount,
        type: form.type,
        category: form.category,
        note: form.note || null,
      },
    })
    
    // Navigate back to home
    navigateTo('/')
  } catch (error) {
    console.error('Failed to save transaction:', error)
    alert('Failed to save transaction. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}
</script>
