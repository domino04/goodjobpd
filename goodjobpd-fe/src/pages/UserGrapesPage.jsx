import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getUserGrapes, deleteGrape, getUserDeletedGrapes } from '../api/grapeApi'
import { getCurrentUser } from '../utils/auth'
import GrapeCluster from '../components/GrapeCluster'

export default function UserGrapesPage() {
  const { raceId } = useParams()
  const user = getCurrentUser()
  const [logs, setLogs] = useState([])
  const [deletedLogs, setDeletedLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  const loadData = async () => {
    try {
      setLoading(true)
      const [logsRes, deletedRes] = await Promise.all([
        getUserGrapes(user.id, Number(raceId)),
        getUserDeletedGrapes(user.id, Number(raceId)),
      ])
      setLogs(logsRes)
      setDeletedLogs(deletedRes)
    } catch (err) {
      console.error(err)
      setError('포도알 내역을 불러오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id, raceId])

  const handleDelete = async (logId) => {
    if (!window.confirm('해당 포도알을 삭제하시겠습니까?')) return
    try {
      setDeletingId(logId)
      await deleteGrape(logId, user.id)
      await loadData()
    } catch (err) {
      console.error(err)
      alert(err?.response?.data?.message || '포도알 삭제에 실패했습니다.')
    } finally {
      setDeletingId(null)
    }
  }

  // ⭐ 포도알(동그라미) 클릭 시 아래 목록의 해당 항목으로 스크롤 이동
  const handleGrapeClick = (index) => {
    const log = logs[index]
    if (!log) return
    const el = document.getElementById(`grape-item-${log.id}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      el.classList.add('highlight')
      setTimeout(() => {
        el.classList.remove('highlight')
      }, 1000)
    }
  }

  return (
      <div className="card">
        <h2>{user.nickname}님의 포도송이</h2>

        {/* 내 포도알 등록 버튼 */}
        <div style={{ marginBottom: 12 }}>
          <Link to={`/races/${raceId}/grapes/new`}>
            <button className="primary">+ 포도알 등록하기</button>
          </Link>
        </div>

        <p style={{ fontSize: 13, color: '#4a5568', marginBottom: 12 }}>
          포도알에 마우스를 올리면 해당 포도알의 인증 내용을 볼 수 있어요.
        </p>

        {loading && <div>불러오는 중...</div>}
        {error && <div style={{ color: 'red' }}>{error}</div>}

        {!loading && (
            <>
              {/* 포도송이 (클릭 시 목록으로 스크롤) */}
              <GrapeCluster
                  logs={logs}
                  targetCnt={30}
                  onGrapeClick={handleGrapeClick}
              />
              <div style={{ marginTop: 12, fontSize: 13, color: '#4a5568' }}>
                총 <strong>{logs.length}</strong>알이 채워졌어요! (최대 30알 표시)
              </div>

              {/* 내 포도알 목록 */}
              <div style={{ marginTop: 24 }}>
                <h3 style={{ marginBottom: 8, fontSize: 15 }}>내 포도알 목록</h3>
                {logs.length === 0 ? (
                    <div style={{ fontSize: 13, color: '#4a5568' }}>
                      아직 적립된 포도알이 없습니다.
                    </div>
                ) : (
                    <div className="list">
                      {logs.map((log, index) => (
                          <div
                              key={log.id}
                              id={`grape-item-${log.id}`}   // ⭐ 스크롤용 anchor
                              className="list-item"
                              style={{ alignItems: 'flex-start' }}
                          >
                            {/* ⭐ 몇 번째 포도인지 표시 */}
                            <div style={{ marginRight: 12, minWidth: 48, textAlign: 'center' }}>
                              <div style={{ fontSize: 11, color: '#a0aec0' }}>No.</div>
                              <div style={{ fontWeight: 700, fontSize: 16 }}>
                                {index + 1}
                              </div>
                            </div>

                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: 12, color: '#4a5568' }}>
                                {log.createdAt}
                              </div>
                              <div style={{ fontWeight: 600, marginTop: 4 }}>
                                {log.type === 'WORKOUT' ? '운동' : '식단'}{' '}
                                {log.minutes ? `(${log.minutes}분)` : ''}
                              </div>
                              {log.description && (
                                  <div style={{ fontSize: 13, marginTop: 4 }}>
                                    {log.description}
                                  </div>
                              )}
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                              {log.imageUrl && (
                                  <img
                                      src={log.imageUrl}
                                      alt="인증"
                                      style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }}
                                  />
                              )}
                              <button
                                  className="secondary"
                                  style={{ fontSize: 12, padding: '4px 8px' }}
                                  onClick={() => handleDelete(log.id)}
                                  disabled={deletingId === log.id}
                              >
                                {deletingId === log.id ? '삭제 중...' : '삭제'}
                              </button>
                            </div>
                          </div>
                      ))}
                    </div>
                )}
              </div>

              {/* 삭제 이력 */}
              <div style={{ marginTop: 32 }}>
                <h3 style={{ marginBottom: 8, fontSize: 15 }}>포도알 삭제 이력</h3>
                {deletedLogs.length === 0 ? (
                    <div style={{ fontSize: 13, color: '#4a5568' }}>
                      아직 삭제한 포도알이 없습니다.
                    </div>
                ) : (
                    <div className="list">
                      {deletedLogs.map((log) => (
                          <div key={log.id} className="list-item" style={{ alignItems: 'flex-start' }}>
                            <div>
                              <div style={{ fontSize: 12, color: '#a0aec0' }}>
                                삭제 시각: {log.deletedAt}
                              </div>
                              <div style={{ fontSize: 12, color: '#4a5568' }}>
                                활동 시각: {log.activityTime}
                              </div>
                              <div style={{ fontWeight: 600, marginTop: 4 }}>
                                {log.type === 'WORKOUT' ? '운동' : '식단'}{' '}
                                {log.minutes ? `(${log.minutes}분)` : ''}
                              </div>
                              {log.description && (
                                  <div style={{ fontSize: 13, marginTop: 4 }}>
                                    {log.description}
                                  </div>
                              )}
                            </div>
                            {log.imageUrl && (
                                <div>
                                  <img
                                      src={log.imageUrl}
                                      alt="삭제된 인증"
                                      style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8, opacity: 0.7 }}
                                  />
                                </div>
                            )}
                          </div>
                      ))}
                    </div>
                )}
              </div>
            </>
        )}
      </div>
  )
}
