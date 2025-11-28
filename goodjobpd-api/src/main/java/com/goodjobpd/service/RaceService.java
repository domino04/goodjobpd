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

    public Race createRace(String name, Integer targetCnt, Integer dailyLimit) {
        Race race = Race.builder()
                .name(name)
                .targetCnt(targetCnt != null ? targetCnt : 30)
                .dailyLimit(dailyLimit != null ? dailyLimit : 2)
                .status(RaceStatus.READY)
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
