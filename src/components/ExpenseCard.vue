<script setup>
const props = defineProps({
  expense: { type: Object, required: true },
})
defineEmits(['remove'])

const fmt = new Intl.NumberFormat('de-CH', { minimumFractionDigits: 2 })
</script>

<template>
  <li
    class="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 last:border-0"
  >
    <div class="min-w-0">
      <p class="truncate font-medium">
        {{ props.expense.description || props.expense.category }}
      </p>
      <p class="text-xs text-slate-500">
        {{ props.expense.date }} · {{ props.expense.category }}
        <a
          v-if="props.expense.receiptUrl"
          :href="props.expense.receiptUrl"
          target="_blank"
          rel="noopener"
          class="ml-1 text-indigo-600 hover:underline"
        >
          📎 Beleg
        </a>
      </p>
    </div>
    <div class="flex items-center gap-3 whitespace-nowrap">
      <span class="font-semibold">
        {{ fmt.format(props.expense.amount) }} {{ props.expense.currency }}
      </span>
      <button
        class="text-slate-400 hover:text-red-600"
        title="Löschen"
        @click="$emit('remove', props.expense.id)"
      >
        ✕
      </button>
    </div>
  </li>
</template>
