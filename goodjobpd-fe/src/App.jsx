import React from 'react'
import { Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import RaceListPage from './pages/RaceListPage'
import RaceCreatePage from './pages/RaceCreatePage'
import RaceDetailPage from './pages/RaceDetailPage'
import GrapeCreatePage from './pages/GrapeCreatePage'
import UserGrapesPage from './pages/UserGrapesPage'
import RaceUserGrapesPage from './pages/RaceUserGrapesPage'

import { getCurrentUser, clearCurrentUser } from './utils/auth'

function Layout({ children }) {
  const user = getCurrentUser()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    clearCurrentUser()
    navigate('/login')
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1><Link to="/races">칭찬포도 🍇</Link></h1>
        <nav>
          {/*<Link to="/races/new">경주 등록</Link>*/}
          {!user && (
            <>
              <Link to="/signup">회원가입</Link>
              <Link to="/login">로그인</Link>
            </>
          )}
          {user && (
            <span className="user-info">
              안녕, <strong>{user.nickname}</strong>님
              <button className="secondary" style={{ marginLeft: 8 }} onClick={handleLogout}>
                로그아웃
              </button>
            </span>
          )}
        </nav>
      </header>
      <main className="app-main">
        {location.pathname !== '/login' && location.pathname !== '/signup' && !user && (
          <div className="card" style={{ marginBottom: 16 }}>
            <strong>로그인이 필요합니다.</strong> 서비스 이용을 위해 먼저
            <Link to="/login" style={{ marginLeft: 4 }}>로그인</Link> 해주세요.
          </div>
        )}
        {children}
      </main>
    </div>
  )
}

function RequireAuth({ children }) {
  const user = getCurrentUser()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  return children
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/races" replace />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/races"
          element={
            <RequireAuth>
              <RaceListPage />
            </RequireAuth>
          }
        />
        <Route
          path="/races/new"
          element={
            <RequireAuth>
              <RaceCreatePage />
            </RequireAuth>
          }
        />
        <Route
          path="/races/:raceId"
          element={
            <RequireAuth>
              <RaceDetailPage />
            </RequireAuth>
          }
        />
        <Route
          path="/races/:raceId/grapes/new"
          element={
            <RequireAuth>
              <GrapeCreatePage />
            </RequireAuth>
          }
        />
        <Route
          path="/races/:raceId/my-grapes"
          element={
            <RequireAuth>
              <UserGrapesPage />
            </RequireAuth>
          }
        />
        <Route
          path="/races/:raceId/users/:userId/grapes"
          element={
            <RequireAuth>
              <RaceUserGrapesPage />
            </RequireAuth>
          }
        />

        <Route path="*" element={<div>페이지를 찾을 수 없습니다.</div>} />
      </Routes>
    </Layout>
  )
}
