import React from 'react'

/**
 * logs: 포도알 로그 배열
 * targetCnt: 최대 포도알 개수
 * onGrapeClick: (index) => void
 */
export default function GrapeCluster({ logs = [], targetCnt = 30, onGrapeClick }) {
    const filledCount = Math.min(logs.length, targetCnt)

    // ⭐ targetCnt에 맞춰 역삼각형 패턴 동적 생성
    const buildPattern = (total, maxPerRow = 7) => {
        if (total <= 0) return []

        // 1) 우선 삼각형의 높이 n을 구함 (1+2+...+n >= total)
        let n = Math.floor((Math.sqrt(8 * total + 1) - 1) / 2)
        if (n < 1) n = 1
        if (n > maxPerRow) n = maxPerRow // 한 줄 최대 길이 제한

        const rows = []
        let remaining = total

        // 2) n, n-1, ..., 1 로 한 번 채움
        while (remaining > 0) {
            for (let size = n; size >= 1 && remaining > 0; size--) {
                const rowSize = Math.min(size, remaining)
                rows.push(rowSize)
                remaining -= rowSize
            }
            // 3) 아직도 remaining 이 남으면, 삼각형 하나 더 쌓기
        }

        return rows
    }

    const pattern = buildPattern(targetCnt)
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
