import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { login } from '../api/authApi'
import { saveCurrentUser } from '../utils/auth'

export default function LoginPage() {
  const [loginId, setLoginId] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!loginId.trim() || !password.trim()) {
      setError('로그인 ID와 비밀번호를 입력해주세요.')
      return
    }

    try {
      setLoading(true)
      const user = await login({
        loginId: loginId.trim(),
        password: password.trim(),
      })
      saveCurrentUser(user)
      const from = location.state?.from?.pathname || '/races'
      navigate(from, { replace: true })
    } catch (err) {
      console.error(err)
      setError(err?.response?.data?.message || '로그인에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h2>로그인</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>로그인 ID</label>
          <input
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            placeholder="이메일 또는 아이디"
          />
        </div>
        <div className="form-group">
          <label>비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
          />
        </div>
        {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
        <button className="primary" type="submit" disabled={loading}>
          {loading ? '로그인 중...' : '로그인'}
        </button>
      </form>
    </div>
  )
}
