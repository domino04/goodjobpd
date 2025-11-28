package com.goodjobpd.domain.grape;

import com.goodjobpd.domain.race.Race;
import com.goodjobpd.domain.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "grape_delete_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GrapeDeleteLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 삭제한 사용자 (= 원래 포도알의 주인)
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
     * 원래 활동 시각
     */
    private LocalDateTime activityTime;

    /**
     * 삭제한 시각
     */
    private LocalDateTime deletedAt;

    /**
     * 원래 GrapeLog의 ID (참고용)
     */
    private Long originalLogId;

    @PrePersist
    public void onCreate() {
        if (this.deletedAt == null) {
            this.deletedAt = LocalDateTime.now();
        }
    }
}
