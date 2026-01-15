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
        <h1 class="text-xl font-bold text-gray-900">About</h1>
        <p class="text-gray-500 text-sm">App information</p>
      </div>
    </header>

    <!-- App Logo & Name -->
    <div class="text-center mb-8">
      <div class="w-24 h-24 mx-auto bg-gradient-to-br from-primary-400 to-primary-600 rounded-3xl flex items-center justify-center shadow-xl mb-4">
        <PhWallet :size="48" weight="fill" class="text-white" />
      </div>
      <h2 class="text-2xl font-bold text-gray-900">Dompetin</h2>
      <p class="text-gray-500">Version 1.0.0</p>
    </div>

    <!-- Info Cards -->
    <div class="space-y-4">
      <!-- Description -->
      <div class="bg-white rounded-2xl p-5 shadow-soft">
        <h3 class="font-semibold text-gray-900 mb-2">About Dompetin</h3>
        <p class="text-gray-600 text-sm leading-relaxed">
          Dompetin is a simple and elegant money tracking application designed to help you manage your personal finances. Track your income and expenses, view statistics, and take control of your financial life.
        </p>
      </div>

      <!-- Features -->
      <div class="bg-white rounded-2xl p-5 shadow-soft">
        <h3 class="font-semibold text-gray-900 mb-3">Features</h3>
        <ul class="space-y-2">
          <li class="flex items-center gap-3 text-sm text-gray-600">
            <PhCheck :size="18" class="text-green-500" weight="bold" />
            Track income & expenses
          </li>
          <li class="flex items-center gap-3 text-sm text-gray-600">
            <PhCheck :size="18" class="text-green-500" weight="bold" />
            Categorize transactions
          </li>
          <li class="flex items-center gap-3 text-sm text-gray-600">
            <PhCheck :size="18" class="text-green-500" weight="bold" />
            View monthly statistics
          </li>
          <li class="flex items-center gap-3 text-sm text-gray-600">
            <PhCheck :size="18" class="text-green-500" weight="bold" />
            Export data to CSV
          </li>
          <li class="flex items-center gap-3 text-sm text-gray-600">
            <PhCheck :size="18" class="text-green-500" weight="bold" />
            Secure authentication
          </li>
        </ul>
      </div>

      <!-- Tech Stack -->
      <div class="bg-white rounded-2xl p-5 shadow-soft">
        <h3 class="font-semibold text-gray-900 mb-3">Built With</h3>
        <div class="flex flex-wrap gap-2">
          <span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Nuxt 3</span>
          <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">Vue 3</span>
          <span class="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-xs font-medium">Tailwind CSS</span>
          <span class="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">Prisma</span>
          <span class="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">Supabase</span>
        </div>
      </div>

      <!-- Credits -->
      <div class="bg-white rounded-2xl p-5 shadow-soft">
        <h3 class="font-semibold text-gray-900 mb-2">Credits</h3>
        <p class="text-gray-600 text-sm">
          Made with ❤️ by Alif Bima Pradana
        </p>
        <p class="text-gray-400 text-xs mt-2">
          © 2024 Dompetin. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PhCaretLeft, PhWallet, PhCheck } from '@phosphor-icons/vue'
</script>
