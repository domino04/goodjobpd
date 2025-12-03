import api from './index'

export async function createRace(name, targetCnt, dailyLimit, userId) {
  const res = await api.post('/api/races', { name, targetCnt, dailyLimit, userId })
  return res.data
}

export async function listRaces() {
  const res = await api.get('/api/races')
  return res.data
}

export async function getRace(id) {
  const res = await api.get(`/api/races/${id}`)
  return res.data
}

export async function joinRace(raceId, userId) {
  const res = await api.post(`/api/races/${raceId}/join`, { userId })
  return res.data
}

export async function getRanking(raceId) {
  const res = await api.get(`/api/races/${raceId}/ranking`)
  return res.data
}

// ⭐ 경주 close
export async function closeRace(raceId, userId) {
  const res = await api.post(`/api/races/${raceId}/close`, {userId})
  return res.data
}

// ⭐ 경주 reopen
export async function reopenRace(raceId, userId) {
  const res = await api.post(`/api/races/${raceId}/reopen`, {userId})
  return res.data
}