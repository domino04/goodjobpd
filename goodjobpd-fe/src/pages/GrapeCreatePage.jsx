import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { addGrape } from '../api/grapeApi'
import { getCurrentUser } from '../utils/auth'
import { getRace } from '../api/raceApi'

function getNowLocalValue() {
  const now = new Date()
  const offsetMs = now.getTime() - now.getTimezoneOffset() * 60000
  const local = new Date(offsetMs)
  return local.toISOString().slice(0, 16) // yyyy-MM-ddTHH:mm
}

export default function GrapeCreatePage() {
  const { raceId } = useParams()
  const user = getCurrentUser()
  const navigate = useNavigate()
  const [race, setRace] = useState(null)
  const [type, setType] = useState('WORKOUT')
  const [minutes, setMinutes] = useState(60)
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [activityTime, setActivityTime] = useState(getNowLocalValue())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchRace = async () => {
      try {
        const data = await getRace(raceId)
        setRace(data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchRace()
  }, [raceId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (type === 'WORKOUT' && (!minutes || Number(minutes) < 60)) {
      setError('운동은 최소 60분 이상이어야 합니다.')
      return
    }

    try {
      setLoading(true)
      await addGrape({
        userId: user.id,
        raceId: Number(raceId),
        type,
        minutes: type === 'WORKOUT' ? Number(minutes) : null,
        description,
        imageUrl: imageUrl || null,
        activityTime: activityTime || null,
      })
      alert('포도알이 등록되었습니다!')
      navigate(`/races/${raceId}`)
    } catch (err) {
      console.error(err)
      setError(err?.response?.data?.message || '포도알 등록에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleNow = () => {
    setActivityTime(getNowLocalValue())
  }

  const isFinished = race?.status === 'FINISHED'

  return (
    <div className="card">
      <h2>포도알 등록</h2>
      {race && (
        <p style={{ fontSize: 13, color: '#4a5568' }}>
          경주: <strong>{race.name}</strong> · 하루 최대{' '}
          <strong>{race.dailyLimit}알</strong>까지 등록할 수 있어요.
        </p>
      )}
      {isFinished && (
        <div style={{ color: '#e53e3e', marginBottom: 8 }}>
          이미 종료된 경주입니다. 포도알을 등록할 수 없습니다.
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>유형 *</label>
          <select value={type} onChange={(e) => setType(e.target.value)} disabled={isFinished}>
            <option value="WORKOUT">운동 (1시간 이상)</option>
            <option value="DIET">식단</option>
          </select>
        </div>

        {type === 'WORKOUT' && (
          <div className="form-group">
            <label>운동 시간(분) *</label>
            <input
              type="number"
              min={60}
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
              disabled={isFinished}
            />
          </div>
        )}

        <div className="form-group">
          <label>한 일 / 메모</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="예: 한강 러닝 6km, 계단오르기..."
            disabled={isFinished}
          />
        </div>

        <div className="form-group">
          <label>인증 사진 URL (선택)</label>
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://..."
            disabled={isFinished}
          />
        </div>

        <div className="form-group">
          <label>활동 일시 *</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="datetime-local"
              value={activityTime}
              onChange={(e) => setActivityTime(e.target.value)}
              style={{ flex: 1 }}
              disabled={isFinished}
            />
            <button
              type="button"
              className="secondary"
              onClick={handleNow}
              disabled={isFinished}
            >
              지금 시간
            </button>
          </div>
        </div>

        {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}

        <button className="primary" type="submit" disabled={loading || isFinished}>
          {loading ? '등록 중...' : '등록하기'}
        </button>
      </form>
    </div>
  )
}
