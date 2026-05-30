import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '@/lib/firebase'
import { useAuthStore } from './auth'

export const CATEGORIES = [
  'Verpflegung',
  'Transport',
  'Unterkunft',
  'Material',
  'Sonstiges',
]

export const useExpensesStore = defineStore('expenses', () => {
  const items = ref([])
  const loading = ref(false)
  const error = ref('')
  let unsubscribe = null

  const total = computed(() =>
    items.value.reduce((sum, e) => sum + (Number(e.amount) || 0), 0),
  )

  const byCategory = computed(() => {
    const acc = {}
    for (const e of items.value) {
      acc[e.category] = (acc[e.category] || 0) + (Number(e.amount) || 0)
    }
    return acc
  })

  // Live subscription to the current user's expenses, newest first.
  // We sort client-side instead of with orderBy() so the query needs only a
  // single-field equality — no Firestore composite index required.
  function subscribe() {
    const auth = useAuthStore()
    if (!auth.user) return
    loading.value = true
    error.value = ''
    const q = query(
      collection(db, 'expenses'),
      where('userId', '==', auth.user.uid),
    )
    unsubscribe = onSnapshot(
      q,
      (snap) => {
        items.value = snap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .sort((a, b) => String(b.date).localeCompare(String(a.date)))
        loading.value = false
      },
      (err) => {
        // Surface failures (missing index, denied rules, …) instead of
        // leaving the list silently stuck on "loading".
        error.value = err.message
        loading.value = false
        console.error('[expenses] snapshot error:', err)
      },
    )
  }

  function unsubscribeAll() {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }
    items.value = []
  }

  async function uploadReceipt(file) {
    const auth = useAuthStore()
    const path = `receipts/${auth.user.uid}/${Date.now()}-${file.name}`
    const r = storageRef(storage, path)
    await uploadBytes(r, file)
    return getDownloadURL(r)
  }

  async function addExpense({ date, amount, currency, category, description, receiptFile }) {
    const auth = useAuthStore()
    const receiptUrl = receiptFile ? await uploadReceipt(receiptFile) : null
    await addDoc(collection(db, 'expenses'), {
      userId: auth.user.uid,
      date,
      amount: Number(amount),
      currency: currency || 'CHF',
      category,
      description: description || '',
      receiptUrl,
      status: 'submitted',
      createdAt: serverTimestamp(),
    })
  }

  async function removeExpense(id) {
    await deleteDoc(doc(db, 'expenses', id))
  }

  return {
    items,
    loading,
    error,
    total,
    byCategory,
    subscribe,
    unsubscribeAll,
    addExpense,
    removeExpense,
    uploadReceipt,
  }
})
