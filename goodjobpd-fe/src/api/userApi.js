import api from './index'

export async function getUser(id) {
  const res = await api.get(`/api/users/${id}`)
  return res.data
}
