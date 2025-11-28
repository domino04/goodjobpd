import api from './index'

export async function addGrape(payload) {
  const res = await api.post('/api/grapes', payload)
  return res.data
}

export async function getUserGrapes(userId, raceId) {
  const res = await api.get(`/api/users/${userId}/grapes`, {
    params: { raceId },
  })
  return res.data
}

// ⭐ 포도알 삭제 (자기 것만)
export async function deleteGrape(grapeId, userId) {
  const res = await api.delete(`/api/grapes/${grapeId}`, {
    params: { userId },
  })
  return res.data
}

// ⭐ 삭제 이력 조회
export async function getUserDeletedGrapes(userId, raceId) {
  const res = await api.get(`/api/users/${userId}/grapes/deleted`, {
    params: { raceId },
  })
  return res.data
}
