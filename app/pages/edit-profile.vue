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
        <h1 class="text-xl font-bold text-gray-900">Edit Profile</h1>
        <p class="text-gray-500 text-sm">Update your information</p>
      </div>
    </header>

    <form @submit.prevent="handleSubmit" class="space-y-5">
      <!-- Profile Picture -->
      <div class="flex justify-center mb-6">
        <div class="w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
          <span class="text-3xl font-bold text-white">{{ userInitial }}</span>
        </div>
      </div>

      <!-- Name Input -->
      <div class="bg-white rounded-2xl p-4 shadow-soft">
        <label class="text-sm font-medium text-gray-500 mb-2 block">Full Name</label>
        <div class="relative">
          <div class="absolute left-4 top-1/2 -translate-y-1/2">
            <PhUser :size="20" class="text-gray-400" />
          </div>
          <input
            v-model="form.name"
            type="text"
            placeholder="Your name"
            required
            class="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
          />
        </div>
      </div>

      <!-- Email (readonly) -->
      <div class="bg-white rounded-2xl p-4 shadow-soft">
        <label class="text-sm font-medium text-gray-500 mb-2 block">Email Address</label>
        <div class="relative">
          <div class="absolute left-4 top-1/2 -translate-y-1/2">
            <PhEnvelope :size="20" class="text-gray-400" />
          </div>
          <input
            :value="user?.email"
            type="email"
            disabled
            class="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-xl text-gray-500 cursor-not-allowed"
          />
        </div>
        <p class="text-xs text-gray-400 mt-2">Email cannot be changed</p>
      </div>

      <!-- Change Password Section -->
      <div class="bg-white rounded-2xl p-4 shadow-soft">
        <div class="flex items-center justify-between mb-3">
          <label class="text-sm font-medium text-gray-500">Change Password</label>
          <button 
            type="button"
            @click="showPasswordFields = !showPasswordFields"
            class="text-primary-500 text-sm font-medium"
          >
            {{ showPasswordFields ? 'Cancel' : 'Change' }}
          </button>
        </div>

        <div v-if="showPasswordFields" class="space-y-3">
          <div class="relative">
            <div class="absolute left-4 top-1/2 -translate-y-1/2">
              <PhLock :size="20" class="text-gray-400" />
            </div>
            <input
              v-model="form.currentPassword"
              type="password"
              placeholder="Current password"
              class="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
            />
          </div>
          <div class="relative">
            <div class="absolute left-4 top-1/2 -translate-y-1/2">
              <PhLock :size="20" class="text-gray-400" />
            </div>
            <input
              v-model="form.newPassword"
              type="password"
              placeholder="New password (min 6 characters)"
              minlength="6"
              class="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
            />
          </div>
        </div>
      </div>

      <!-- Error/Success Message -->
      <div v-if="message" :class="isError ? 'bg-red-50 border-red-200 text-red-600' : 'bg-green-50 border-green-200 text-green-600'" class="border rounded-xl px-4 py-3">
        <p class="text-sm">{{ message }}</p>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="isSubmitting"
        class="w-full py-4 bg-primary-500 text-white rounded-2xl font-bold text-base shadow-lg shadow-primary-500/30 disabled:opacity-50 transition-all active:scale-[0.98]"
      >
        {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { PhCaretLeft, PhUser, PhEnvelope, PhLock } from '@phosphor-icons/vue'

const { user, updateUser } = useAuth()

const form = reactive({
  name: user.value?.name || '',
  currentPassword: '',
  newPassword: '',
})

const showPasswordFields = ref(false)
const isSubmitting = ref(false)
const message = ref('')
const isError = ref(false)

const userInitial = computed(() => {
  return form.name?.charAt(0).toUpperCase() || 'U'
})

// Sync form with user data
watch(() => user.value, (newUser) => {
  if (newUser) {
    form.name = newUser.name
  }
}, { immediate: true })

const handleSubmit = async () => {
  message.value = ''
  isSubmitting.value = true

  try {
    const body: any = { name: form.name }
    
    if (showPasswordFields.value && form.newPassword) {
      body.currentPassword = form.currentPassword
      body.newPassword = form.newPassword
    }

    const response = await $fetch<{ user: any; message: string }>('/api/auth/profile', {
      method: 'PUT',
      body,
    })

    updateUser(response.user)
    message.value = response.message
    isError.value = false
    
    // Reset password fields
    form.currentPassword = ''
    form.newPassword = ''
    showPasswordFields.value = false

  } catch (err: any) {
    message.value = err.data?.message || 'Failed to update profile'
    isError.value = true
  } finally {
    isSubmitting.value = false
  }
}
</script>
