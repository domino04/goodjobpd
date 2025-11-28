import api from './index'

export async function signUp(payload) {
  const res = await api.post('/api/auth/sign-up', payload)
  return res.data
}

export async function login(payload) {
  const res = await api.post('/api/auth/login', payload)
  return res.data
}
