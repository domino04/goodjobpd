package com.goodjobpd.domain.grape;

import com.goodjobpd.domain.race.Race;
import com.goodjobpd.domain.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GrapeDeleteLogRepository extends JpaRepository<GrapeDeleteLog, Long> {

    List<GrapeDeleteLog> findByUserAndRaceOrderByDeletedAtDesc(User user, Race race);
}
