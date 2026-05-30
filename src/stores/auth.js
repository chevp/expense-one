import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { auth } from '@/lib/firebase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const ready = ref(false)

  const isAuthenticated = computed(() => !!user.value)

  // Resolves once Firebase has restored the persisted session, so the
  // router guard never redirects before we know who is logged in.
  const init = () =>
    new Promise((resolve) => {
      onAuthStateChanged(auth, (u) => {
        user.value = u
        ready.value = true
        resolve(u)
      })
    })

  const loginWithGoogle = () => signInWithPopup(auth, new GoogleAuthProvider())
  const loginWithEmail = (email, password) =>
    signInWithEmailAndPassword(auth, email, password)
  const registerWithEmail = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password)
  const logout = () => signOut(auth)

  return {
    user,
    ready,
    isAuthenticated,
    init,
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    logout,
  }
})
