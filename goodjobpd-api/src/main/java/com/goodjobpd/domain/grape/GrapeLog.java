package com.goodjobpd.domain.grape;

import com.goodjobpd.domain.race.Race;
import com.goodjobpd.domain.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "grape_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GrapeLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "race_id")
    private Race race;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private GrapeType type;

    private Integer minutes;

    @Column(length = 255)
    private String description;

    @Column(length = 255)
    private String imageUrl;

    /**
     * 사용자가 실제로 활동한 시점 (화면에서 입력)
     */
    private LocalDateTime activityTime;

    /**
     * 서버에 기록된 생성 시점
     */
    private LocalDateTime createdAt;

    @PrePersist
    public void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        if (this.createdAt == null) {
            this.createdAt = now;
        }
        if (this.activityTime == null) {
            this.activityTime = this.createdAt;
        }
    }
}
