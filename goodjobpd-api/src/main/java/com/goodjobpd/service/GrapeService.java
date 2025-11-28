package com.goodjobpd.service;

import com.goodjobpd.domain.grape.GrapeDeleteLog;
import com.goodjobpd.domain.grape.GrapeDeleteLogRepository;
import com.goodjobpd.domain.grape.GrapeLog;
import com.goodjobpd.domain.grape.GrapeLogRepository;
import com.goodjobpd.domain.grape.GrapeType;
import com.goodjobpd.domain.race.Race;
import com.goodjobpd.domain.race.RaceMember;
import com.goodjobpd.domain.race.RaceMemberRepository;
import com.goodjobpd.domain.race.RaceRepository;
import com.goodjobpd.domain.race.RaceStatus;
import com.goodjobpd.domain.user.User;
import com.goodjobpd.domain.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class GrapeService {

    private final GrapeLogRepository grapeLogRepository;
    private final GrapeDeleteLogRepository grapeDeleteLogRepository;
    private final RaceRepository raceRepository;
    private final RaceMemberRepository raceMemberRepository;
    private final UserRepository userRepository;

    public GrapeLog addGrape(Long userId,
                             Long raceId,
                             GrapeType type,
                             Integer minutes,
                             String description,
                             String imageUrl,
                             LocalDateTime activityTime) {

        if (type == GrapeType.WORKOUT) {
            if (minutes == null || minutes < 60) {
                throw new IllegalArgumentException("Workout must be at least 60 minutes.");
            }
        }

        Race race = raceRepository.findById(raceId)
                .orElseThrow(() -> new IllegalArgumentException("Race not found: " + raceId));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        if (race.getStatus() == RaceStatus.FINISHED) {
            throw new IllegalStateException("이미 종료된 경주에는 포도알을 등록할 수 없습니다.");
        }

        RaceMember member = raceMemberRepository.findByRaceAndUser(race, user)
                .orElseThrow(() -> new IllegalStateException("User is not joined in this race."));

        int dailyLimit = race.getDailyLimit() != null ? race.getDailyLimit() : 2;

        LocalDateTime effectiveActivity = activityTime != null ? activityTime : LocalDateTime.now();
        LocalDate day = effectiveActivity.toLocalDate();
        LocalDateTime startOfDay = day.atStartOfDay();
        LocalDateTime endOfDay = day.atTime(23, 59, 59, 999000000);

        long todayCount = grapeLogRepository.countByUserAndRaceAndActivityTimeBetween(
                user, race, startOfDay, endOfDay
        );

        if (todayCount >= dailyLimit) {
            throw new IllegalArgumentException("하루 최대 " + dailyLimit + "개의 포도알만 등록할 수 있습니다.");
        }

        GrapeLog log = GrapeLog.builder()
                .user(user)
                .race(race)
                .type(type)
                .minutes(minutes)
                .description(description)
                .imageUrl(imageUrl)
                .activityTime(effectiveActivity)
                .build();

        GrapeLog saved = grapeLogRepository.save(log);

        int current = member.getGrapeCount() == null ? 0 : member.getGrapeCount();
        member.setGrapeCount(current + 1);

        if (!Boolean.TRUE.equals(member.getWinner()) && member.getGrapeCount() >= race.getTargetCnt()) {
            member.setWinner(true);
            race.setStatus(RaceStatus.FINISHED);
        }

        return saved;
    }

    @Transactional(readOnly = true)
    public List<GrapeLog> getUserGrapes(Long userId, Long raceId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
        Race race = raceRepository.findById(raceId)
                .orElseThrow(() -> new IllegalArgumentException("Race not found: " + raceId));

        return grapeLogRepository.findByUserAndRaceOrderByActivityTimeDesc(user, race);
    }

    /**
     * 자신의 포도알만 삭제 가능.
     * 삭제 시 삭제 이력을 grape_delete_logs 테이블에 남기고,
     * 실제 GrapeLog는 삭제한다.
     */
    public void deleteGrape(Long logId, Long userId) {
        GrapeLog log = grapeLogRepository.findById(logId)
                .orElseThrow(() -> new IllegalArgumentException("GrapeLog not found: " + logId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        if (!log.getUser().getId().equals(user.getId())) {
            throw new IllegalStateException("자신의 포도알만 삭제할 수 있습니다.");
        }

        Race race = log.getRace();

        // 삭제 이력 기록
        GrapeDeleteLog deleteLog = GrapeDeleteLog.builder()
                .user(user)
                .race(race)
                .type(log.getType())
                .minutes(log.getMinutes())
                .description(log.getDescription())
                .imageUrl(log.getImageUrl())
                .activityTime(log.getActivityTime())
                .originalLogId(log.getId())
                .build();
        grapeDeleteLogRepository.save(deleteLog);

        // 실제 포도알 삭제
        grapeLogRepository.delete(log);

        // 회원의 포도알 개수 조정 (0 이하로 내려가지 않도록)
        raceMemberRepository.findByRaceAndUser(race, user).ifPresent(member -> {
            int current = member.getGrapeCount() == null ? 0 : member.getGrapeCount();
            member.setGrapeCount(Math.max(0, current - 1));
        });

        // 경주 상태/우승자 재계산까지는 하지 않고, 단순 카운트만 줄이는 정책으로 유지
    }

    @Transactional(readOnly = true)
    public List<GrapeDeleteLog> getUserDeletedGrapes(Long userId, Long raceId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
        Race race = raceRepository.findById(raceId)
                .orElseThrow(() -> new IllegalArgumentException("Race not found: " + raceId));

        return grapeDeleteLogRepository.findByUserAndRaceOrderByDeletedAtDesc(user, race);
    }
}
