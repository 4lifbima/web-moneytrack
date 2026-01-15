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
        <div class="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-slide-up">
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
                  <PhDeviceMobile :size="16" class="text-blue-600" weight="fill" />
                </div>
                <p class="text-sm text-gray-600">Tampilan seperti aplikasi native</p>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <PhRocket :size="16" class="text-purple-600" weight="fill" />
                </div>
                <p class="text-sm text-gray-600">Performa lebih cepat</p>
              </div>
            </div>

            <!-- iOS Instructions -->
            <div v-if="isIOS" class="bg-gray-50 rounded-xl p-4 mb-4">
              <p class="text-sm text-gray-600 text-center">
                Tap <PhShareNetwork :size="16" class="inline text-blue-500" /> lalu pilih <strong>"Add to Home Screen"</strong>
              </p>
            </div>

            <!-- Buttons -->
            <div class="space-y-3">
              <button
                v-if="canInstall"
                @click="install"
                class="w-full py-4 bg-primary-500 text-white rounded-2xl font-bold shadow-lg shadow-primary-500/30 active:scale-[0.98] transition-all"
              >
                Install Sekarang
              </button>
              <button
                @click="dismiss"
                class="w-full py-3 text-gray-500 font-medium"
              >
                {{ canInstall ? 'Nanti saja' : 'Mengerti' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { PhLightning, PhDeviceMobile, PhRocket, PhShareNetwork } from '@phosphor-icons/vue'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const showPrompt = ref(false)
const canInstall = ref(false)
const isIOS = ref(false)
let deferredPrompt: BeforeInstallPromptEvent | null = null

onMounted(() => {
  // Detect iOS
  isIOS.value = /iPad|iPhone|iPod/.test(navigator.userAgent)

  // Check if already installed (standalone mode)
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                       (window.navigator as any).standalone === true

  if (isStandalone) {
    return // Already installed, don't show prompt
  }

  // Check if dismissed recently
  const dismissed = localStorage.getItem('pwa_prompt_dismissed')
  const dismissedTime = dismissed ? parseInt(dismissed) : 0
  const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24)

  if (daysSinceDismissed < 3) {
    return // Dismissed within 3 days
  }

  // Listen for beforeinstallprompt event (Android/Chrome)
  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault()
    deferredPrompt = e as BeforeInstallPromptEvent
    canInstall.value = true
  })

  // Show prompt after 2 seconds regardless
  setTimeout(() => {
    showPrompt.value = true
    // If beforeinstallprompt fired, canInstall will be true
    // Otherwise, show iOS instructions or just informational
  }, 2000)
})

const install = async () => {
  if (!deferredPrompt) return

  deferredPrompt.prompt()
  const { outcome } = await deferredPrompt.userChoice
  
  if (outcome === 'accepted') {
    showPrompt.value = false
    localStorage.setItem('pwa_installed', 'true')
  }
  
  deferredPrompt = null
  canInstall.value = false
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

@keyframes slideUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-slide-up {
  animation: slideUp 0.3s ease-out;
}
</style>
