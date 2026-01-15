<template>
  <div class="px-4 py-6 max-w-lg mx-auto">
    <!-- Header -->
    <header class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Profile</h1>
      <p class="text-gray-500 text-sm mt-1">Settings & preferences</p>
    </header>

    <!-- Profile Card -->
    <NuxtLink to="/edit-profile" class="block bg-white rounded-2xl p-5 shadow-soft mb-6 hover:shadow-md transition-shadow">
      <div class="flex items-center gap-4">
        <div class="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
          <span class="text-2xl font-bold text-white">{{ userInitial }}</span>
        </div>
        <div class="flex-1 min-w-0">
          <h2 class="text-lg font-bold text-gray-900 truncate">{{ user?.name || 'User' }}</h2>
          <p class="text-gray-500 text-sm truncate">{{ user?.email || 'user@email.com' }}</p>
        </div>
        <PhCaretRight :size="20" class="text-gray-400 flex-shrink-0" />
      </div>
    </NuxtLink>

    <!-- Settings List -->
    <div class="bg-white rounded-2xl shadow-soft overflow-hidden">
      <!-- Currency Setting -->
      <NuxtLink to="/currency" class="flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
            <PhCurrencyCircleDollar :size="20" class="text-green-600" />
          </div>
          <div class="text-left">
            <p class="font-medium text-gray-900">Currency</p>
            <p class="text-sm text-gray-500">{{ currentCurrency }}</p>
          </div>
        </div>
        <PhCaretRight :size="20" class="text-gray-400" />
      </NuxtLink>

      <!-- Export Data -->
      <NuxtLink to="/export" class="flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
            <PhExport :size="20" class="text-purple-600" />
          </div>
          <div class="text-left">
            <p class="font-medium text-gray-900">Export Data</p>
            <p class="text-sm text-gray-500">Download your data</p>
          </div>
        </div>
        <PhCaretRight :size="20" class="text-gray-400" />
      </NuxtLink>

      <!-- User Guide -->
      <NuxtLink to="/guide" class="flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <PhBookOpen :size="20" class="text-blue-600" />
          </div>
          <div class="text-left">
            <p class="font-medium text-gray-900">Cara Penggunaan</p>
            <p class="text-sm text-gray-500">Panduan aplikasi</p>
          </div>
        </div>
        <PhCaretRight :size="20" class="text-gray-400" />
      </NuxtLink>

      <!-- About -->
      <NuxtLink to="/about" class="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
            <PhInfo :size="20" class="text-primary-600" />
          </div>
          <div class="text-left">
            <p class="font-medium text-gray-900">About</p>
            <p class="text-sm text-gray-500">Version 1.0.0</p>
          </div>
        </div>
        <PhCaretRight :size="20" class="text-gray-400" />
      </NuxtLink>
    </div>

    <!-- Logout Button -->
    <button
      @click="handleLogout"
      :disabled="isLoggingOut"
      class="w-full mt-6 flex items-center justify-center gap-3 py-4 bg-red-50 text-red-600 rounded-2xl font-semibold hover:bg-red-100 transition-colors disabled:opacity-50"
    >
      <PhSignOut :size="20" weight="bold" />
      {{ isLoggingOut ? 'Logging out...' : 'Log Out' }}
    </button>

    <!-- App Info -->
    <div class="mt-8 text-center">
      <div class="flex items-center justify-center gap-2 mb-2">
        <div class="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
          <PhWallet :size="18" weight="fill" class="text-white" />
        </div>
        <span class="text-xl font-bold text-gray-900">Dompetin</span>
      </div>
      <p class="text-gray-400 text-sm">Simple money tracking</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  PhCurrencyCircleDollar, PhExport, PhInfo, 
  PhCaretRight, PhWallet, PhSignOut, PhBookOpen 
} from '@phosphor-icons/vue'

const { user, logout } = useAuth()

const userInitial = computed(() => {
  return user.value?.name?.charAt(0).toUpperCase() || 'U'
})

const currentCurrency = ref('Indonesian Rupiah (IDR)')

const isLoggingOut = ref(false)

onMounted(() => {
  const saved = localStorage.getItem('dompetin_currency')
  if (saved) {
    const currencyNames: Record<string, string> = {
      'IDR': 'Indonesian Rupiah (IDR)',
      'USD': 'US Dollar (USD)',
      'EUR': 'Euro (EUR)',
      'GBP': 'British Pound (GBP)',
      'JPY': 'Japanese Yen (JPY)',
      'SGD': 'Singapore Dollar (SGD)',
      'MYR': 'Malaysian Ringgit (MYR)',
      'AUD': 'Australian Dollar (AUD)',
    }
    currentCurrency.value = currencyNames[saved] || 'Indonesian Rupiah (IDR)'
  }
})

const handleLogout = async () => {
  isLoggingOut.value = true
  try {
    await logout()
  } finally {
    isLoggingOut.value = false
  }
}
</script>
