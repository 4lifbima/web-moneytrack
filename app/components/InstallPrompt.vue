<template>
  <!-- Backdrop -->
  <Teleport to="body">
    <Transition name="fade">
      <div 
        v-if="showPrompt" 
        class="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4"
        @click.self="dismiss"
      >
        <!-- Modal Card -->
        <Transition name="slide-up">
          <div 
            v-if="showPrompt"
            class="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
          >
            <!-- Header with gradient -->
            <div class="bg-gradient-to-br from-primary-500 to-primary-600 p-6 text-center">
              <div class="w-20 h-20 mx-auto bg-white rounded-2xl flex items-center justify-center shadow-lg mb-4">
                <img src="/Dompetin.png" alt="Dompetin" class="w-14 h-14" />
              </div>
              <h2 class="text-xl font-bold text-white">Install Dompetin</h2>
              <p class="text-primary-100 text-sm mt-1">Akses lebih cepat & nyaman</p>
            </div>

            <!-- Content -->
            <div class="p-6">
              <!-- Benefits -->
              <div class="space-y-3 mb-6">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <PhLightning :size="16" class="text-green-600" weight="fill" />
                  </div>
                  <p class="text-sm text-gray-600">Akses langsung dari home screen</p>
                </div>
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <PhWifiSlash :size="16" class="text-blue-600" weight="fill" />
                  </div>
                  <p class="text-sm text-gray-600">Bisa digunakan offline</p>
                </div>
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <PhRocket :size="16" class="text-purple-600" weight="fill" />
                  </div>
                  <p class="text-sm text-gray-600">Performa lebih cepat</p>
                </div>
              </div>

              <!-- Buttons -->
              <div class="space-y-3">
                <button
                  @click="install"
                  class="w-full py-4 bg-primary-500 text-white rounded-2xl font-bold shadow-lg shadow-primary-500/30 active:scale-[0.98] transition-all"
                >
                  Install Sekarang
                </button>
                <button
                  @click="dismiss"
                  class="w-full py-3 text-gray-500 font-medium"
                >
                  Nanti saja
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { PhLightning, PhWifiSlash, PhRocket } from '@phosphor-icons/vue'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const showPrompt = ref(false)
let deferredPrompt: BeforeInstallPromptEvent | null = null

onMounted(() => {
  // Check if already installed
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches
  const dismissed = localStorage.getItem('pwa_prompt_dismissed')
  const dismissedTime = dismissed ? parseInt(dismissed) : 0
  const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24)

  // Don't show if installed or dismissed within 7 days
  if (isStandalone || daysSinceDismissed < 7) {
    return
  }

  // Listen for beforeinstallprompt event
  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault()
    deferredPrompt = e as BeforeInstallPromptEvent
    
    // Show prompt after a short delay
    setTimeout(() => {
      showPrompt.value = true
    }, 2000)
  })
})

const install = async () => {
  if (!deferredPrompt) {
    // For iOS, show manual instructions
    alert('Untuk install di iOS:\n1. Tap tombol Share\n2. Pilih "Add to Home Screen"')
    return
  }

  deferredPrompt.prompt()
  const { outcome } = await deferredPrompt.userChoice
  
  if (outcome === 'accepted') {
    showPrompt.value = false
  }
  
  deferredPrompt = null
}

const dismiss = () => {
  showPrompt.value = false
  localStorage.setItem('pwa_prompt_dismissed', Date.now().toString())
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
