import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { listRaces, joinRace } from '../api/raceApi'
import { getCurrentUser } from '../utils/auth'

function statusBadgeClass(status) {
  switch (status) {
    case 'READY':
      return 'badge ready'
    case 'RUNNING':
      return 'badge running'
    case 'FINISHED':
      return 'badge finished'
    default:
      return 'badge'
  }
}

export default function RaceListPage() {
  const [races, setRaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [joiningId, setJoiningId] = useState(null)
  const navigate = useNavigate()
  const user = getCurrentUser()

  useEffect(() => {
    const fetchRaces = async () => {
      try {
        setLoading(true)
        const data = await listRaces()
        setRaces(data)
      } catch (err) {
        console.error(err)
        setError('경주 목록을 불러오지 못했습니다.')
      } finally {
        setLoading(false)
      }
    }
    fetchRaces()
  }, [])

  const handleJoin = async (raceId) => {
    try {
      setJoiningId(raceId)
      await joinRace(raceId, user.id)
      navigate(`/races/${raceId}`)
    } catch (err) {
      console.error(err)
      alert(err?.response?.data?.message || '경주 참가에 실패했습니다.')
    } finally {
      setJoiningId(null)
    }
  }

  return (
    <div className="card">
      <h2>경주 목록</h2>
      <div style={{ marginBottom: 8 }}>
        <Link to="/races/new">
          <button className="primary">+ 새 경주 만들기</button>
        </Link>
      </div>
      {loading && <div>불러오는 중...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {!loading && races.length === 0 && <div>아직 생성된 경주가 없습니다.</div>}
      <div className="list">
        {races.map((race) => (
          <div key={race.id} className="list-item">
            <div>
              <Link to={`/races/${race.id}`}>
                <strong>{race.name}</strong>
              </Link>
              <div style={{ fontSize: 12, color: '#4a5568' }}>
                목표 포도알: {race.targetCnt}알 · 하루 최대 {race.dailyLimit}알
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className={statusBadgeClass(race.status)}>
                {race.status}
              </span>
              <button
                className="secondary"
                onClick={() => handleJoin(race.id)}
                disabled={joiningId === race.id}
              >
                {joiningId === race.id ? '참가 중...' : '참가하기'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
