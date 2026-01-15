<template>
  <div class="relative pb-20">
    <!-- Main Content -->
    <main class="min-h-screen">
      <slot />
    </main>

    <!-- Bottom Navigation -->
    <BottomNav />

    <!-- PWA Install Prompt -->
    <ClientOnly>
      <InstallPrompt />
    </ClientOnly>
  </div>
</template>
