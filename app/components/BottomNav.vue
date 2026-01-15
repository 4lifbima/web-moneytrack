<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-lg safe-bottom z-50">
    <div class="flex items-center justify-around h-16 max-w-lg mx-auto">
      <!-- Home -->
      <NuxtLink 
        to="/" 
        class="flex flex-col items-center justify-center w-16 h-full transition-colors"
        :class="isActive('/') ? 'text-primary-500' : 'text-gray-400'"
      >
        <PhHouse :size="24" :weight="isActive('/') ? 'fill' : 'regular'" />
        <span class="text-xs mt-1 font-medium">Home</span>
      </NuxtLink>

      <!-- Transactions -->
      <NuxtLink 
        to="/transactions" 
        class="flex flex-col items-center justify-center w-16 h-full transition-colors"
        :class="isActive('/transactions') ? 'text-primary-500' : 'text-gray-400'"
      >
        <PhListBullets :size="24" :weight="isActive('/transactions') ? 'fill' : 'regular'" />
        <span class="text-xs mt-1 font-medium">History</span>
      </NuxtLink>

      <!-- Add Button (Center) -->
      <NuxtLink 
        to="/add" 
        class="flex items-center justify-center w-14 h-14 -mt-6 bg-primary-500 rounded-full shadow-lg shadow-primary-500/40 transition-transform active:scale-95"
      >
        <PhPlus :size="28" weight="bold" class="text-white" />
      </NuxtLink>

      <!-- Stats -->
      <NuxtLink 
        to="/stats" 
        class="flex flex-col items-center justify-center w-16 h-full transition-colors"
        :class="isActive('/stats') ? 'text-primary-500' : 'text-gray-400'"
      >
        <PhChartBar :size="24" :weight="isActive('/stats') ? 'fill' : 'regular'" />
        <span class="text-xs mt-1 font-medium">Stats</span>
      </NuxtLink>

      <!-- Profile -->
      <NuxtLink 
        to="/profile" 
        class="flex flex-col items-center justify-center w-16 h-full transition-colors"
        :class="isActive('/profile') ? 'text-primary-500' : 'text-gray-400'"
      >
        <PhUser :size="24" :weight="isActive('/profile') ? 'fill' : 'regular'" />
        <span class="text-xs mt-1 font-medium">Profile</span>
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { PhHouse, PhListBullets, PhPlus, PhChartBar, PhUser } from '@phosphor-icons/vue'

const route = useRoute()

const isActive = (path: string) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}
</script>
