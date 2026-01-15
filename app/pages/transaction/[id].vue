<template>
  <div class="px-4 py-6 max-w-lg mx-auto">
    <!-- Header -->
    <header class="flex items-center gap-4 mb-6">
      <button 
        @click="navigateTo('/transactions')" 
        class="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-soft"
      >
        <PhCaretLeft :size="20" class="text-gray-600" />
      </button>
      <div class="flex-1">
        <h1 class="text-xl font-bold text-gray-900">{{ isEditing ? 'Edit Transaction' : 'Transaction Detail' }}</h1>
        <p class="text-gray-500 text-sm">{{ isEditing ? 'Update your transaction' : 'View transaction details' }}</p>
      </div>
      <button 
        v-if="!isEditing && transaction"
        @click="isEditing = true"
        class="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center"
      >
        <PhPencil :size="20" class="text-primary-600" />
      </button>
    </header>

    <!-- Loading State -->
    <div v-if="pending" class="space-y-4">
      <div class="bg-white rounded-2xl p-6 h-40 animate-pulse" />
      <div class="bg-white rounded-2xl p-4 h-20 animate-pulse" />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <div class="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
        <PhWarning :size="32" class="text-red-500" />
      </div>
      <p class="text-gray-600 mb-4">Transaction not found</p>
      <NuxtLink to="/transactions" class="text-primary-500 font-medium">
        Back to Transactions
      </NuxtLink>
    </div>

    <!-- Transaction Detail / Edit Form -->
    <div v-else-if="transaction" class="space-y-5">
      <!-- Amount Display/Input -->
      <div class="bg-white rounded-2xl p-6 shadow-soft">
        <div v-if="!isEditing" class="text-center">
          <p class="text-sm text-gray-500 mb-2">Amount</p>
          <p 
            class="text-3xl font-bold"
            :class="transaction.type === 'income' ? 'text-green-600' : 'text-red-600'"
          >
            {{ transaction.type === 'income' ? '+' : '-' }}{{ formatCurrency(transaction.amount) }}
          </p>
        </div>
        <div v-else>
          <label class="text-sm font-medium text-gray-500 mb-2 block">Amount</label>
          <div class="flex items-center gap-2">
            <span class="text-xl font-bold text-gray-400">Rp</span>
            <input
              v-model.number="form.amount"
              type="number"
              required
              min="1"
              class="flex-1 text-2xl font-bold text-gray-900 bg-transparent outline-none"
            />
          </div>
        </div>
      </div>

      <!-- Type -->
      <div class="bg-white rounded-2xl p-4 shadow-soft">
        <label class="text-sm font-medium text-gray-500 mb-3 block">Type</label>
        <div v-if="!isEditing" class="flex items-center gap-3">
          <div 
            class="w-10 h-10 rounded-xl flex items-center justify-center"
            :class="transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'"
          >
            <component 
              :is="transaction.type === 'income' ? PhArrowDown : PhArrowUp" 
              :size="20" 
              :class="transaction.type === 'income' ? 'text-green-600' : 'text-red-600'"
              weight="bold"
            />
          </div>
          <span class="font-medium text-gray-900 capitalize">{{ transaction.type }}</span>
        </div>
        <div v-else class="grid grid-cols-2 gap-2">
          <button
            type="button"
            @click="form.type = 'income'"
            class="flex items-center justify-center gap-2 px-3 py-3 rounded-xl font-medium transition-all text-sm"
            :class="form.type === 'income' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'"
          >
            <PhArrowDown :size="18" weight="bold" />
            Income
          </button>
          <button
            type="button"
            @click="form.type = 'expense'"
            class="flex items-center justify-center gap-2 px-3 py-3 rounded-xl font-medium transition-all text-sm"
            :class="form.type === 'expense' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600'"
          >
            <PhArrowUp :size="18" weight="bold" />
            Expense
          </button>
        </div>
      </div>

      <!-- Category -->
      <div class="bg-white rounded-2xl p-4 shadow-soft">
        <label class="text-sm font-medium text-gray-500 mb-3 block">Category</label>
        <div v-if="!isEditing" class="flex items-center gap-3">
          <div class="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
            <component :is="getCategoryIcon(transaction.category)" :size="20" class="text-primary-600" />
          </div>
          <span class="font-medium text-gray-900">{{ transaction.category }}</span>
        </div>
        <div v-else class="grid grid-cols-4 gap-2">
          <button
            v-for="category in filteredCategories"
            :key="category.id"
            type="button"
            @click="form.category = category.name"
            class="flex flex-col items-center gap-1 p-2 rounded-xl transition-all"
            :class="form.category === category.name ? 'bg-primary-500 text-white' : 'bg-gray-50 text-gray-600'"
          >
            <component :is="getCategoryIcon(category.name)" :size="20" />
            <span class="text-[10px] font-medium truncate w-full text-center">{{ category.name }}</span>
          </button>
        </div>
      </div>

      <!-- Note -->
      <div class="bg-white rounded-2xl p-4 shadow-soft">
        <label class="text-sm font-medium text-gray-500 mb-2 block">Note</label>
        <p v-if="!isEditing" class="text-gray-900">{{ transaction.note || 'No note' }}</p>
        <input
          v-else
          v-model="form.note"
          type="text"
          placeholder="Add a note..."
          class="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
        />
      </div>

      <!-- Date -->
      <div class="bg-white rounded-2xl p-4 shadow-soft">
        <label class="text-sm font-medium text-gray-500 mb-2 block">Date</label>
        <p class="text-gray-900">{{ formatDate(transaction.createdAt) }}</p>
      </div>

      <!-- Edit Mode Buttons -->
      <div v-if="isEditing" class="flex gap-3">
        <button
          @click="cancelEdit"
          class="flex-1 py-4 bg-gray-100 text-gray-700 rounded-2xl font-bold"
        >
          Cancel
        </button>
        <button
          @click="saveEdit"
          :disabled="isSaving"
          class="flex-1 py-4 bg-primary-500 text-white rounded-2xl font-bold shadow-lg shadow-primary-500/30 disabled:opacity-50"
        >
          {{ isSaving ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>

      <!-- Delete Button (View Mode) -->
      <button
        v-if="!isEditing"
        @click="showDeleteModal = true"
        class="w-full flex items-center justify-center gap-3 py-4 bg-red-50 text-red-600 rounded-2xl font-semibold"
      >
        <PhTrash :size="20" />
        Delete Transaction
      </button>
    </div>

    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <div 
        v-if="showDeleteModal" 
        class="fixed inset-0 bg-black/50 flex items-end justify-center z-50 p-4"
        @click.self="showDeleteModal = false"
      >
        <div class="bg-white rounded-2xl w-full max-w-md p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-2">Delete Transaction?</h3>
          <p class="text-gray-500 text-sm mb-6">This action cannot be undone.</p>
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
import { 
  PhCaretLeft, PhPencil, PhWarning, PhArrowDown, PhArrowUp, PhTrash,
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

interface Category {
  id: number
  name: string
  icon: string
  type: string
}

const route = useRoute()
const id = route.params.id as string

const { data: transaction, pending, error, refresh } = useFetch<Transaction>(`/api/transactions/${id}`)
const { data: categories } = useFetch<Category[]>('/api/categories')

const isEditing = ref(false)
const isSaving = ref(false)
const isDeleting = ref(false)
const showDeleteModal = ref(false)

const form = reactive({
  amount: 0,
  type: 'expense' as 'income' | 'expense',
  category: '',
  note: '',
})

// Sync form with transaction data
watch(transaction, (t) => {
  if (t) {
    form.amount = t.amount
    form.type = t.type as 'income' | 'expense'
    form.category = t.category
    form.note = t.note || ''
  }
}, { immediate: true })

const filteredCategories = computed(() => {
  if (!categories.value) return []
  return categories.value.filter(c => c.type === form.type)
})

// Reset category when type changes in edit mode
watch(() => form.type, (newType) => {
  if (isEditing.value && transaction.value && newType !== transaction.value.type) {
    form.category = ''
  }
})

const categoryIcons: Record<string, any> = {
  'Salary': PhMoney, 'Freelance': PhLaptop, 'Investment': PhChartLineUp, 'Gift': PhGift,
  'Food': PhHamburger, 'Transport': PhCar, 'Shopping': PhShoppingBag, 'Bills': PhReceipt,
  'Entertainment': PhGameController, 'Health': PhFirstAidKit, 'Education': PhGraduationCap,
  'Other': PhDotsThreeCircle,
}

const getCategoryIcon = (category: string) => categoryIcons[category] || PhDotsThreeCircle

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
  }).format(amount)
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

const cancelEdit = () => {
  isEditing.value = false
  if (transaction.value) {
    form.amount = transaction.value.amount
    form.type = transaction.value.type as 'income' | 'expense'
    form.category = transaction.value.category
    form.note = transaction.value.note || ''
  }
}

const saveEdit = async () => {
  if (!form.amount || !form.category) return
  isSaving.value = true
  try {
    await $fetch(`/api/transactions/${id}`, {
      method: 'PUT',
      body: { amount: form.amount, type: form.type, category: form.category, note: form.note || null },
    })
    await refresh()
    isEditing.value = false
  } catch (err) {
    console.error('Failed to update:', err)
    alert('Failed to update transaction')
  } finally {
    isSaving.value = false
  }
}

const deleteTransaction = async () => {
  isDeleting.value = true
  try {
    await $fetch(`/api/transactions/${id}`, { method: 'DELETE' })
    navigateTo('/transactions')
  } catch (err) {
    console.error('Failed to delete:', err)
  } finally {
    isDeleting.value = false
  }
}
</script>
