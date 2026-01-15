<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-500 via-primary-600 to-orange-700 flex flex-col">
    <!-- Top Section with Logo -->
    <div class="flex-1 flex flex-col items-center justify-center px-6 pt-8 pb-6">
      <div class="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-2xl mb-6">
        <PhWallet :size="40" weight="fill" class="text-primary-500" />
      </div>
      <h1 class="text-3xl font-bold text-white mb-2">Create Account</h1>
      <p class="text-primary-100 text-center">Start your journey to financial freedom</p>
    </div>

    <!-- Register Form Card -->
    <div class="bg-white rounded-t-[2.5rem] px-6 py-8 shadow-2xl">
      <form @submit.prevent="handleRegister" class="space-y-4">
        <!-- Name Input -->
        <div>
          <label class="text-sm font-medium text-gray-600 mb-2 block">Full Name</label>
          <div class="relative">
            <div class="absolute left-4 top-1/2 -translate-y-1/2">
              <PhUser :size="20" class="text-gray-400" />
            </div>
            <input
              v-model="form.name"
              type="text"
              placeholder="Enter your name"
              required
              class="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-xl border border-gray-100 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
            />
          </div>
        </div>

        <!-- Email Input -->
        <div>
          <label class="text-sm font-medium text-gray-600 mb-2 block">Email Address</label>
          <div class="relative">
            <div class="absolute left-4 top-1/2 -translate-y-1/2">
              <PhEnvelope :size="20" class="text-gray-400" />
            </div>
            <input
              v-model="form.email"
              type="email"
              placeholder="Enter your email"
              required
              class="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-xl border border-gray-100 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
            />
          </div>
        </div>

        <!-- Password Input -->
        <div>
          <label class="text-sm font-medium text-gray-600 mb-2 block">Password</label>
          <div class="relative">
            <div class="absolute left-4 top-1/2 -translate-y-1/2">
              <PhLock :size="20" class="text-gray-400" />
            </div>
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Create a password"
              required
              minlength="6"
              class="w-full pl-12 pr-12 py-4 bg-gray-50 rounded-xl border border-gray-100 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-4 top-1/2 -translate-y-1/2"
            >
              <PhEye v-if="!showPassword" :size="20" class="text-gray-400" />
              <PhEyeSlash v-else :size="20" class="text-gray-400" />
            </button>
          </div>
          <p class="text-xs text-gray-400 mt-1">Minimum 6 characters</p>
        </div>

        <!-- Confirm Password Input -->
        <div>
          <label class="text-sm font-medium text-gray-600 mb-2 block">Confirm Password</label>
          <div class="relative">
            <div class="absolute left-4 top-1/2 -translate-y-1/2">
              <PhLock :size="20" class="text-gray-400" />
            </div>
            <input
              v-model="form.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="Confirm your password"
              required
              class="w-full pl-12 pr-12 py-4 bg-gray-50 rounded-xl border border-gray-100 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
            />
            <button
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              class="absolute right-4 top-1/2 -translate-y-1/2"
            >
              <PhEye v-if="!showConfirmPassword" :size="20" class="text-gray-400" />
              <PhEyeSlash v-else :size="20" class="text-gray-400" />
            </button>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <p class="text-red-600 text-sm">{{ error }}</p>
        </div>

        <!-- Register Button -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full py-4 bg-primary-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-primary-500/30 disabled:opacity-50 transition-all active:scale-[0.98]"
        >
          <span v-if="!isLoading">Create Account</span>
          <span v-else class="flex items-center justify-center gap-2">
            <PhSpinner :size="20" class="animate-spin" />
            Creating account...
          </span>
        </button>

        <!-- Login Link -->
        <div class="text-center pt-4">
          <p class="text-gray-600">
            Already have an account?
            <NuxtLink to="/login" class="text-primary-500 font-semibold ml-1">
              Sign In
            </NuxtLink>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PhWallet, PhUser, PhEnvelope, PhLock, PhEye, PhEyeSlash, PhSpinner } from '@phosphor-icons/vue'

definePageMeta({
  layout: false,
})

const { register, isAuthenticated } = useAuth()

// Redirect if already authenticated
watchEffect(() => {
  if (isAuthenticated.value) {
    navigateTo('/')
  }
})

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isLoading = ref(false)
const error = ref('')

const handleRegister = async () => {
  error.value = ''

  // Validate passwords match
  if (form.password !== form.confirmPassword) {
    error.value = 'Passwords do not match'
    return
  }

  isLoading.value = true

  try {
    await register(form.name, form.email, form.password)
    navigateTo('/')
  } catch (err: any) {
    error.value = err.data?.message || 'Failed to create account. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>
