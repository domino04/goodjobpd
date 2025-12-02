import React from 'react'
import { useParams } from 'react-router-dom'
import UserGrapesPage from './UserGrapesPage'

export default function RaceUserGrapesPage() {
  const { raceId, userId } = useParams()

  // raceId는 UserGrapesPage 안에서 useParams로 이미 사용 중이므로
  // 여기서는 userId만 prop으로 넘겨주면 됨
  return <UserGrapesPage userId={Number(userId)} />
}
