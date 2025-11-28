package com.goodjobpd.domain.race;

import com.goodjobpd.domain.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RaceMemberRepository extends JpaRepository<RaceMember, Long> {

    List<RaceMember> findByRaceOrderByGrapeCountDesc(Race race);

    Optional<RaceMember> findByRaceAndUser(Race race, User user);
}
