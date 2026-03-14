<template>
  <div class="min-h-screen flex flex-col relative overflow-x-hidden">
    <!-- Ambient background -->
    <div class="pointer-events-none fixed inset-0 -z-10">
      <div class="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-accent-500/[0.07] blur-[100px] dark:bg-accent-500/[0.04]" />
      <div class="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-purple-500/[0.05] blur-[100px] dark:bg-purple-500/[0.03]" />
    </div>

    <AppHeader />
    <main class="flex-1">
      <slot />
    </main>
    <AppFooter />
    <ToastContainer />
  </div>
</template>
