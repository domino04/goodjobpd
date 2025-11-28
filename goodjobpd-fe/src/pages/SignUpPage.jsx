import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signUp } from '../api/authApi'
import { saveCurrentUser } from '../utils/auth'

export default function SignUpPage() {
  const [loginId, setLoginId] = useState('')
  const [password, setPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!loginId.trim() || !password.trim() || !nickname.trim()) {
      setError('로그인 ID, 비밀번호, 닉네임은 필수입니다.')
      return
    }

    try {
      setLoading(true)
      const user = await signUp({
        loginId: loginId.trim(),
        password: password.trim(),
        nickname: nickname.trim(),
        avatarUrl: avatarUrl.trim() || null,
      })
      saveCurrentUser(user)
      navigate('/races')
    } catch (err) {
      console.error(err)
      setError(err?.response?.data?.message || '회원가입에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>로그인 ID *</label>
          <input
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            placeholder="이메일 또는 아이디"
          />
        </div>
        <div className="form-group">
          <label>비밀번호 *</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
          />
        </div>
        <div className="form-group">
          <label>닉네임 *</label>
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="화면에 표시될 이름"
          />
        </div>
        <div className="form-group">
          <label>아바타 이미지 URL (선택)</label>
          <input
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://..."
          />
        </div>
        {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
        <button className="primary" type="submit" disabled={loading}>
          {loading ? '가입 중...' : '회원가입'}
        </button>
      </form>
    </div>
  )
}
