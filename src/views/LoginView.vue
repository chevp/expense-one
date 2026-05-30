<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

const email = ref('')
const password = ref('')
const isRegister = ref(false)
const error = ref('')
const busy = ref(false)

function redirect() {
  router.push(route.query.redirect || { name: 'dashboard' })
}

async function submitEmail() {
  error.value = ''
  busy.value = true
  try {
    if (isRegister.value) {
      await auth.registerWithEmail(email.value, password.value)
    } else {
      await auth.loginWithEmail(email.value, password.value)
    }
    redirect()
  } catch (e) {
    error.value = e.message
  } finally {
    busy.value = false
  }
}

async function google() {
  error.value = ''
  busy.value = true
  try {
    await auth.loginWithGoogle()
    redirect()
  } catch (e) {
    error.value = e.message
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <div class="mx-auto mt-12 max-w-sm">
    <h1 class="mb-1 text-center text-2xl font-bold">💸 expense-one</h1>
    <p class="mb-6 text-center text-sm text-slate-500">
      {{ isRegister ? 'Konto erstellen' : 'Anmelden, um deine Spesen zu verwalten' }}
    </p>

    <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <form class="space-y-3" @submit.prevent="submitEmail">
        <input
          v-model="email"
          type="email"
          required
          placeholder="E-Mail"
          class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
        />
        <input
          v-model="password"
          type="password"
          required
          minlength="6"
          placeholder="Passwort"
          class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
        />
        <button
          type="submit"
          :disabled="busy"
          class="w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {{ isRegister ? 'Registrieren' : 'Anmelden' }}
        </button>
      </form>

      <div class="my-4 flex items-center gap-3 text-xs text-slate-400">
        <span class="h-px flex-1 bg-slate-200" /> oder
        <span class="h-px flex-1 bg-slate-200" />
      </div>

      <button
        :disabled="busy"
        class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-50 disabled:opacity-50"
        @click="google"
      >
        Mit Google anmelden
      </button>

      <p v-if="error" class="mt-3 text-sm text-red-600">{{ error }}</p>

      <button
        class="mt-4 w-full text-center text-sm text-indigo-600 hover:underline"
        @click="isRegister = !isRegister"
      >
        {{ isRegister ? 'Schon ein Konto? Anmelden' : 'Neu hier? Konto erstellen' }}
      </button>
    </div>
  </div>
</template>
