import React from 'react'

/**
 * logs: 포도알 로그 배열
 * targetCnt: 최대 포도알 개수 (기본 30)
 * onGrapeClick: (index) => void  // ⭐ 추가: 채워진 포도 클릭 시 콜백
 */
export default function GrapeCluster({ logs = [], targetCnt = 30, onGrapeClick }) {
  const filledCount = Math.min(logs.length, targetCnt)

  const pattern = [7, 6, 5, 4, 3, 3, 2] // 7+6+5+4+3+3+2 = 30
  const rows = []

  const getTooltipContent = (log) => {
    if (!log) {
      return (
          <>
            <div className="grape-tooltip-empty">아직 채워지지 않은 포도알이에요.</div>
          </>
      )
    }

    return (
        <>
          <div className="grape-tooltip-title">
            {log.type === 'WORKOUT' ? '운동' : '식단'}{' '}
            {log.minutes ? `(${log.minutes}분)` : ''}
          </div>
          {log.createdAt && (
              <div className="grape-tooltip-date">{log.createdAt}</div>
          )}
          {log.description && (
              <div className="grape-tooltip-desc">{log.description}</div>
          )}
          {log.imageUrl && (
              <div className="grape-tooltip-img-note">📷 인증 사진 등록됨</div>
          )}
        </>
    )
  }

  let grapeNumber = 1
  for (const count of pattern) {
    if (grapeNumber > targetCnt) break
    const row = []
    for (let i = 0; i < count && grapeNumber <= targetCnt; i++) {
      const logIndex = grapeNumber - 1
      const log = grapeNumber <= filledCount ? logs[logIndex] : null
      const isFilled = !!log
      row.push(
          <div
              key={grapeNumber}
              className={`grape ${isFilled ? 'filled' : ''}`}
              onClick={
                isFilled && onGrapeClick
                    ? () => onGrapeClick(logIndex)
                    : undefined
              }
          >
            <span className="grape-label">{grapeNumber}</span>
            <div className="grape-tooltip">
              {getTooltipContent(log)}
            </div>
          </div>
      )
      grapeNumber++
    }
    rows.push(
        <div key={`row-${rows.length}`} className="grape-row">
          {row}
        </div>
    )
  }

  return (
      <div className="grape-cluster-wrapper">
        <div className="grape-cluster">
          {rows}
        </div>
      </div>
  )
}
