import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createRace } from '../api/raceApi'

export default function RaceCreatePage() {
  const [name, setName] = useState('')
  const [targetCnt, setTargetCnt] = useState(30)
  const [dailyLimit, setDailyLimit] = useState(2)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!name.trim()) {
      setError('경주 이름을 입력해주세요.')
      return
    }
    try {
      setLoading(true)
      const race = await createRace(
        name.trim(),
        Number(targetCnt) || 30,
        Number(dailyLimit) || 2
      )
      navigate(`/races/${race.id}`)
    } catch (err) {
      console.error(err)
      setError(err?.response?.data?.message || '경주 생성에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h2>경주 등록</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>경주 이름 *</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="예: 10월 운동 경주"
          />
        </div>
        <div className="form-group">
          <label>목표 포도알 수 *</label>
          <input
            type="number"
            value={targetCnt}
            onChange={(e) => setTargetCnt(e.target.value)}
            min={1}
          />
        </div>
        <div className="form-group">
          <label>하루 최대 포도알 수 *</label>
          <input
            type="number"
            value={dailyLimit}
            onChange={(e) => setDailyLimit(e.target.value)}
            min={1}
          />
        </div>
        {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
        <button className="primary" type="submit" disabled={loading}>
          {loading ? '등록 중...' : '생성하기'}
        </button>
      </form>
    </div>
  )
}
