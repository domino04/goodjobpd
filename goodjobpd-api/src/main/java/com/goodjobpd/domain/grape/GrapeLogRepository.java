package com.goodjobpd.domain.grape;

import com.goodjobpd.domain.race.Race;
import com.goodjobpd.domain.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;

public interface GrapeLogRepository extends JpaRepository<GrapeLog, Long> {

    java.util.List<GrapeLog> findByUserAndRaceOrderByActivityTimeDesc(User user, Race race);

    long countByUserAndRaceAndActivityTimeBetween(
            User user,
            Race race,
            LocalDateTime start,
            LocalDateTime end
    );
}
