import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
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
  function subscribe() {
    const auth = useAuthStore()
    if (!auth.user) return
    loading.value = true
    const q = query(
      collection(db, 'expenses'),
      where('userId', '==', auth.user.uid),
      orderBy('date', 'desc'),
    )
    unsubscribe = onSnapshot(q, (snap) => {
      items.value = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      loading.value = false
    })
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
    total,
    byCategory,
    subscribe,
    unsubscribeAll,
    addExpense,
    removeExpense,
    uploadReceipt,
  }
})
