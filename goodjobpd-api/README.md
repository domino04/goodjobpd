# goodjobpd-api (v3)

칭찬 포도알 레이스 백엔드 (Spring Boot 3, Java 17, H2, JPA)

## 이번 변경 사항

1. 경주별 하루 포도알 제한
   - `Race.dailyLimit` 필드 추가 (기본값 2)
   - 경주 생성 시 `dailyLimit` 값을 함께 등록
   - GrapeService에서 사용자/경주/날짜별 포도알 개수 체크 후 제한 초과 시 예외 발생

2. 포도알 활동 일시 입력
   - `GrapeLog.activityTime` 필드 추가
   - API 요청의 `activityTime`(yyyy-MM-dd'T'HH:mm) 값을 기준으로 저장
   - 응답에서는 `createdAt` 필드에 활동 시점을 내려줌

3. FINISHED 경주에 대한 포도알 등록 금지
   - Race 상태가 `FINISHED`인 경우, 포도알 등록 시 `IllegalStateException` 발생
   - 우승 조건: 해당 경주 targetCnt 이상 채운 사용자가 나오면
     - 해당 사용자 RaceMember.winner = true
     - Race.status = FINISHED

## 주요 API

- Auth
  - POST /api/auth/sign-up
  - POST /api/auth/login
- User
  - GET /api/users/{id}
- Race
  - POST /api/races
    - body: { "name", "targetCnt", "dailyLimit" }
  - GET /api/races
  - GET /api/races/{id}
  - POST /api/races/{id}/join
  - GET /api/races/{id}/ranking
- Grape
  - POST /api/grapes
    - body: { "userId", "raceId", "type", "minutes", "description", "imageUrl", "activityTime" }
  - GET /api/users/{userId}/grapes?raceId={raceId}

H2 콘솔: `/h2-console`
