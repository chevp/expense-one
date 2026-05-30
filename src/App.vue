<script setup>
import { computed } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

const email = computed(() => auth.user?.email || auth.user?.displayName || '')

async function logout() {
  await auth.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-900">
    <header
      v-if="auth.isAuthenticated"
      class="border-b border-slate-200 bg-white"
    >
      <div class="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <RouterLink :to="{ name: 'dashboard' }" class="text-lg font-semibold">
          💸 expense-one
        </RouterLink>
        <nav class="flex items-center gap-4 text-sm">
          <RouterLink
            :to="{ name: 'new-expense' }"
            class="rounded-md bg-indigo-600 px-3 py-1.5 font-medium text-white hover:bg-indigo-700"
          >
            + Neue Spese
          </RouterLink>
          <span class="hidden text-slate-500 sm:inline">{{ email }}</span>
          <button class="text-slate-500 hover:text-slate-900" @click="logout">
            Abmelden
          </button>
        </nav>
      </div>
    </header>

    <main class="mx-auto max-w-3xl px-4 py-6">
      <RouterView />
    </main>
  </div>
</template>
