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
        <h1 class="text-xl font-bold text-gray-900">Currency</h1>
        <p class="text-gray-500 text-sm">Select your currency</p>
      </div>
    </header>

    <!-- Currency List -->
    <div class="bg-white rounded-2xl shadow-soft overflow-hidden">
      <button
        v-for="currency in currencies"
        :key="currency.code"
        @click="selectCurrency(currency.code)"
        class="w-full flex items-center justify-between p-4 border-b border-gray-50 last:border-b-0 hover:bg-gray-50 transition-colors"
      >
        <div class="flex items-center gap-4">
          <span class="text-2xl">{{ currency.flag }}</span>
          <div class="text-left">
            <p class="font-medium text-gray-900">{{ currency.name }}</p>
            <p class="text-sm text-gray-500">{{ currency.code }}</p>
          </div>
        </div>
        <div v-if="selectedCurrency === currency.code" class="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
          <PhCheck :size="14" weight="bold" class="text-white" />
        </div>
      </button>
    </div>

    <!-- Info -->
    <div class="mt-4 bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
      <div class="flex items-start gap-3">
        <PhWarning :size="20" class="text-yellow-600 flex-shrink-0 mt-0.5" />
        <p class="text-yellow-700 text-sm">
          Currency setting is for display purposes only. All amounts are stored in their original values.
        </p>
      </div>
    </div>

    <!-- Save Button -->
    <button
      @click="saveCurrency"
      :disabled="isSaving"
      class="w-full mt-6 py-4 bg-primary-500 text-white rounded-2xl font-bold shadow-lg shadow-primary-500/30 disabled:opacity-50 transition-all active:scale-[0.98]"
    >
      {{ isSaving ? 'Saving...' : 'Save Currency' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { PhCaretLeft, PhCheck, PhWarning } from '@phosphor-icons/vue'

const currencies = [
  { code: 'IDR', name: 'Indonesian Rupiah', flag: '🇮🇩' },
  { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
  { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵' },
  { code: 'SGD', name: 'Singapore Dollar', flag: '🇸🇬' },
  { code: 'MYR', name: 'Malaysian Ringgit', flag: '🇲🇾' },
  { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺' },
]

const selectedCurrency = ref('IDR')
const isSaving = ref(false)

// Load from localStorage
onMounted(() => {
  const saved = localStorage.getItem('dompetin_currency')
  if (saved) {
    selectedCurrency.value = saved
  }
})

const selectCurrency = (code: string) => {
  selectedCurrency.value = code
}

const saveCurrency = () => {
  isSaving.value = true
  
  // Save to localStorage
  localStorage.setItem('dompetin_currency', selectedCurrency.value)
  
  setTimeout(() => {
    isSaving.value = false
    navigateTo('/profile')
  }, 500)
}
</script>
