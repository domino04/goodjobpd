import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getUserGrapes } from '../api/grapeApi'
import { getUser } from '../api/userApi'
import GrapeCluster from '../components/GrapeCluster'
import { getCurrentUser } from '../utils/auth'
import UserGrapesPage from './UserGrapesPage'   // ⭐ 추가

export default function RaceUserGrapesPage() {
  const { raceId, userId } = useParams()
  const currentUser = getCurrentUser()

  // ⭐ 로그인 사용자의 페이지라면 UserGrapesPage와 완전히 동일한 화면 사용
  if (currentUser && Number(userId) === currentUser.id) {
    return <UserGrapesPage />
  }

  const [logs, setLogs] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true)
        const [userData, logsData] = await Promise.all([
          getUser(userId),
          getUserGrapes(userId, Number(raceId)),
        ])
        setUser(userData)
        setLogs(logsData)
      } catch (err) {
        console.error(err)
        setError('포도알 내역을 불러오지 못했습니다.')
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [userId, raceId])

  return (
      <div className="card">
        <h2>{user ? `${user.nickname}님의 포도송이` : '포도송이'}</h2>
        <p style={{ fontSize: 13, color: '#4a5568', marginBottom: 12 }}>
          포도알에 마우스를 올리면 해당 포도알의 인증 내용을 볼 수 있어요.
        </p>
        {loading && <div>불러오는 중...</div>}
        {error && <div style={{ color: 'red' }}>{error}</div>}
        {!loading && (
            <>
              <GrapeCluster logs={logs} targetCnt={30} />
              <div style={{ marginTop: 12, fontSize: 13, color: '#4a5568' }}>
                총 <strong>{logs.length}</strong>알이 채워졌어요! (최대 30알 표시)
              </div>
            </>
        )}
      </div>
  )
}
