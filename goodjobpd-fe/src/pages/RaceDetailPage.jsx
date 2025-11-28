import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getRace, getRanking, joinRace } from '../api/raceApi'
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

export default function RaceDetailPage() {
  const { raceId } = useParams()
  const [race, setRace] = useState(null)
  const [ranking, setRanking] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [joining, setJoining] = useState(false)
  const [joined, setJoined] = useState(false)
  const user = getCurrentUser()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [raceData, rankData] = await Promise.all([
          getRace(raceId),
          getRanking(raceId),
        ])
        setRace(raceData)
        setRanking(rankData)
        if (user) {
          setJoined(rankData.some((r) => r.userId === user.id))
        }
      } catch (err) {
        console.error(err)
        setError('경주 정보를 불러오지 못했습니다.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
    // 🔥 user 전체가 아니라, id 값만 의존하게 하거나 아예 raceId만 두는 게 안전
  }, [raceId, user?.id])

  const handleJoin = async () => {
    try {
      setJoining(true)
      await joinRace(raceId, user.id)
      alert('경주에 참가했습니다.')
      setJoined(true)
    } catch (err) {
      console.error(err)
      alert(err?.response?.data?.message || '경주 참가에 실패했습니다.')
    } finally {
      setJoining(false)
    }
  }

  if (loading) return <div className="card">불러오는 중...</div>
  if (error) return <div className="card" style={{ color: 'red' }}>{error}</div>
  if (!race) return <div className="card">경주가 존재하지 않습니다.</div>

  const isFinished = race.status === 'FINISHED'

  return (
      <div className="card">
        <h2>{race.name}</h2>
        <div style={{ marginBottom: 8, fontSize: 14 }}>
          목표 포도알: <strong>{race.targetCnt}알</strong> · 하루 최대{' '}
          <strong>{race.dailyLimit}알</strong>
        </div>
        <div style={{ marginBottom: 12, fontSize: 14 }}>
          상태: <span className={statusBadgeClass(race.status)}>{race.status}</span>
        </div>

        <div style={{ marginBottom: 16 }}>
          {/* 참가 버튼 */}
          <button
              className="secondary"
              onClick={handleJoin}
              disabled={joining || isFinished || joined}
          >
            {joined ? '참가중' : joining ? '참가 중...' : '경주 참가'}
          </button>

          {/* 참가한 상태일 때만 포도 등록 / 내 포도 보기 버튼 표시 */}
          {joined && (
              <>
                {' '}
                <Link to={`/races/${raceId}/grapes/new`}>
                  <button className="primary" disabled={isFinished}>
                    포도알 등록
                  </button>
                </Link>
                {' '}
                <Link to={`/races/${raceId}/my-grapes`}>
                  <button className="secondary">내 포도 보기</button>
                </Link>
              </>
          )}

          {isFinished && (
              <div style={{ marginTop: 8, fontSize: 12, color: '#e53e3e' }}>
                이미 종료된 경주입니다. 포도알을 더 이상 등록할 수 없습니다.
              </div>
          )}
        </div>

        <h3>현재 순위</h3>
        {ranking.length === 0 ? (
            <div>아직 등록된 포도알이 없습니다.</div>
        ) : (
            <table className="rank-table">
              <thead>
              <tr>
                <th>순위</th>
                <th>닉네임</th>
                <th>포도알</th>
                <th>승자</th>
              </tr>
              </thead>
              <tbody>
              {(() => {
                let lastGrapeCount = null
                let lastRank = 0

                return ranking.map((r, idx) => {
                  let displayRank

                  if (lastGrapeCount === null) {
                    // 첫 번째 사람은 무조건 1등
                    displayRank = 1
                  } else if (r.grapeCount === lastGrapeCount) {
                    // 이전 사람이랑 포도알 개수 같으면 같은 등수
                    displayRank = lastRank
                  } else {
                    // 다르면 현재 인덱스 기준으로 순위 부여
                    displayRank = idx + 1
                  }

                  lastGrapeCount = r.grapeCount
                  lastRank = displayRank

                  return (
                      <tr key={r.userId}>
                        <td>{displayRank}</td>
                        <td>
                          <Link to={`/races/${raceId}/users/${r.userId}/grapes`}>
                            {r.nickname}
                          </Link>
                        </td>
                        <td>{r.grapeCount}</td>
                        <td>{r.winner ? '👑' : ''}</td>
                      </tr>
                  )
                })
              })()}
              </tbody>
            </table>
        )}
      </div>
  )
}
