<script setup>
import { onMounted, onUnmounted, computed } from 'vue'
import { useExpensesStore } from '@/stores/expenses'
import ExpenseCard from '@/components/ExpenseCard.vue'

const store = useExpensesStore()

const fmt = new Intl.NumberFormat('de-CH', { minimumFractionDigits: 2 })
const categories = computed(() => Object.entries(store.byCategory))

onMounted(() => store.subscribe())
onUnmounted(() => store.unsubscribeAll())
</script>

<template>
  <section>
    <div class="mb-6 grid gap-4 sm:grid-cols-2">
      <div class="rounded-xl border border-slate-200 bg-white p-5">
        <p class="text-sm text-slate-500">Total</p>
        <p class="mt-1 text-3xl font-bold">{{ fmt.format(store.total) }} CHF</p>
        <p class="mt-1 text-xs text-slate-400">{{ store.items.length }} Spesen</p>
      </div>
      <div class="rounded-xl border border-slate-200 bg-white p-5">
        <p class="mb-2 text-sm text-slate-500">Nach Kategorie</p>
        <ul v-if="categories.length" class="space-y-1 text-sm">
          <li
            v-for="[cat, sum] in categories"
            :key="cat"
            class="flex justify-between"
          >
            <span class="text-slate-600">{{ cat }}</span>
            <span class="font-medium">{{ fmt.format(sum) }}</span>
          </li>
        </ul>
        <p v-else class="text-sm text-slate-400">Noch keine Daten</p>
      </div>
    </div>

    <div class="rounded-xl border border-slate-200 bg-white">
      <div class="border-b border-slate-100 px-4 py-3 font-medium">
        Letzte Spesen
      </div>

      <p v-if="store.loading" class="px-4 py-6 text-sm text-slate-400">
        Lädt…
      </p>
      <ul v-else-if="store.items.length">
        <ExpenseCard
          v-for="e in store.items"
          :key="e.id"
          :expense="e"
          @remove="store.removeExpense"
        />
      </ul>
      <p v-else class="px-4 py-6 text-sm text-slate-400">
        Noch keine Spesen erfasst.
      </p>
    </div>
  </section>
</template>
