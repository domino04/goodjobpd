const STORAGE_KEY = 'goodjobpd_user'

export function saveCurrentUser(user) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
}

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch (e) {
    console.error('Failed to parse user from storage', e)
    return null
  }
}

export function clearCurrentUser() {
  localStorage.removeItem(STORAGE_KEY)
}
