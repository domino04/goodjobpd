package com.goodjobpd.domain.race;

import com.goodjobpd.domain.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "race_members",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_race_member",
                columnNames = {"race_id", "user_id"}
        ))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RaceMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "race_id")
    private Race race;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false)
    private Integer grapeCount;

    private Boolean winner;

    private LocalDateTime joinedAt;

    @PrePersist
    public void onCreate() {
        this.joinedAt = LocalDateTime.now();
        if (this.grapeCount == null) {
            this.grapeCount = 0;
        }
        if (this.winner == null) {
            this.winner = false;
        }
    }
}
