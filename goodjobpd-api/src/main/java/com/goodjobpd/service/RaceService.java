package com.goodjobpd.service;

import com.goodjobpd.domain.race.*;
import com.goodjobpd.domain.user.User;
import com.goodjobpd.domain.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class RaceService {

    private final RaceRepository raceRepository;
    private final RaceMemberRepository raceMemberRepository;
    private final UserRepository userRepository;

    public Race createRace(String name, Integer targetCnt, Integer dailyLimit, Long creatorUserId) {
        User creator = null;
        if (creatorUserId != null) {
            creator = userRepository.findById(creatorUserId)
                    .orElseThrow(() -> new IllegalArgumentException("User not found: " + creatorUserId));
        }

        Race race = Race.builder()
                .name(name)
                .targetCnt(targetCnt != null ? targetCnt : 30)
                .dailyLimit(dailyLimit != null ? dailyLimit : 2)
                .status(RaceStatus.READY)
                .createdBy(creator)
                .build();
        return raceRepository.save(race);
    }

    @Transactional(readOnly = true)
    public Race getRace(Long id) {
        return raceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Race not found: " + id));
    }

    @Transactional(readOnly = true)
    public List<Race> listRaces() {
        return raceRepository.findAll();
    }

    public RaceMember joinRace(Long raceId, Long userId) {
        Race race = getRace(raceId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        return raceMemberRepository.findByRaceAndUser(race, user)
                .orElseGet(() -> {
                    RaceMember member = RaceMember.builder()
                            .race(race)
                            .user(user)
                            .grapeCount(0)
                            .winner(false)
                            .build();
                    return raceMemberRepository.save(member);
                });
    }

    // ⭐ 경주 닫기
    public Race closeRace(Long raceId, Long userId) {
        Race race = getRace(raceId);

        validateOwner(race, userId);

        // 이미 FINISHED/CLOSED 인 경우 로직은 정책에 따라:
        // 여기서는 FINISHED는 닫을 수 없고, CLOSED는 그냥 그대로 리턴
        if (race.getStatus() == RaceStatus.FINISHED) {
            throw new IllegalStateException("이미 종료된 경주는 close 할 수 없습니다.");
        }
        if (race.getStatus() == RaceStatus.CLOSED) {
            return race;
        }

        race.setStatus(RaceStatus.CLOSED);
        return race;
    }

    // ⭐ 경주 다시 열기
    public Race reopenRace(Long raceId, Long userId) {
        Race race = getRace(raceId);

        validateOwner(race, userId);

        if (race.getStatus() != RaceStatus.CLOSED) {
            throw new IllegalStateException("CLOSED 상태인 경주만 다시 열 수 있습니다.");
        }

        // 어떤 상태로 돌릴지는 정책(READY / IN_PROGRESS)
        race.setStatus(RaceStatus.READY);
        return race;
    }

    private void validateOwner(Race race, Long userId) {
        if (race.getCreatedBy() == null || !race.getCreatedBy().getId().equals(userId)) {
            throw new IllegalStateException("경주 생성자만 이 작업을 수행할 수 있습니다.");
        }
    }

    @Transactional(readOnly = true)
    public List<RaceRanking> getRanking(Long raceId) {
        Race race = getRace(raceId);
        List<RaceMember> members = raceMemberRepository.findByRaceOrderByGrapeCountDesc(race);

        return members.stream()
                .sorted(Comparator.comparing(RaceMember::getGrapeCount).reversed())
                .map(m -> new RaceRanking(
                        m.getUser().getId(),
                        m.getUser().getNickname(),
                        m.getGrapeCount(),
                        m.getWinner() != null && m.getWinner()
                ))
                .collect(Collectors.toList());
    }

    public static record RaceRanking(Long userId, String nickname, Integer grapeCount, boolean winner) {}
}
