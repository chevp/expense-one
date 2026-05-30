<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useExpensesStore, CATEGORIES } from '@/stores/expenses'

const store = useExpensesStore()
const router = useRouter()

const today = new Date().toISOString().slice(0, 10)

const form = ref({
  date: today,
  amount: '',
  currency: 'CHF',
  category: CATEGORIES[0],
  description: '',
})
const receiptFile = ref(null)
const busy = ref(false)
const error = ref('')

function onFile(e) {
  receiptFile.value = e.target.files[0] || null
}

async function submit() {
  error.value = ''
  busy.value = true
  try {
    await store.addExpense({ ...form.value, receiptFile: receiptFile.value })
    router.push({ name: 'dashboard' })
  } catch (e) {
    error.value = e.message
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <section class="mx-auto max-w-md">
    <h1 class="mb-4 text-xl font-bold">Neue Spese</h1>

    <form
      class="space-y-4 rounded-xl border border-slate-200 bg-white p-6"
      @submit.prevent="submit"
    >
      <div class="grid grid-cols-2 gap-3">
        <label class="block text-sm">
          <span class="mb-1 block text-slate-600">Datum</span>
          <input
            v-model="form.date"
            type="date"
            required
            class="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
          />
        </label>
        <label class="block text-sm">
          <span class="mb-1 block text-slate-600">Kategorie</span>
          <select
            v-model="form.category"
            class="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
          >
            <option v-for="c in CATEGORIES" :key="c" :value="c">{{ c }}</option>
          </select>
        </label>
      </div>

      <div class="grid grid-cols-3 gap-3">
        <label class="col-span-2 block text-sm">
          <span class="mb-1 block text-slate-600">Betrag</span>
          <input
            v-model="form.amount"
            type="number"
            step="0.01"
            min="0"
            required
            placeholder="0.00"
            class="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
          />
        </label>
        <label class="block text-sm">
          <span class="mb-1 block text-slate-600">Währung</span>
          <input
            v-model="form.currency"
            type="text"
            maxlength="3"
            class="w-full rounded-md border border-slate-300 px-3 py-2 uppercase focus:border-indigo-500 focus:outline-none"
          />
        </label>
      </div>

      <label class="block text-sm">
        <span class="mb-1 block text-slate-600">Beschreibung</span>
        <input
          v-model="form.description"
          type="text"
          placeholder="z. B. Mittagessen mit Kunde"
          class="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
        />
      </label>

      <label class="block text-sm">
        <span class="mb-1 block text-slate-600">Beleg (optional)</span>
        <input
          type="file"
          accept="image/*,application/pdf"
          class="w-full text-sm text-slate-500 file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm hover:file:bg-slate-200"
          @change="onFile"
        />
      </label>

      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>

      <div class="flex gap-2">
        <button
          type="submit"
          :disabled="busy"
          class="flex-1 rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {{ busy ? 'Speichert…' : 'Speichern' }}
        </button>
        <RouterLink
          :to="{ name: 'dashboard' }"
          class="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-50"
        >
          Abbrechen
        </RouterLink>
      </div>
    </form>
  </section>
</template>
