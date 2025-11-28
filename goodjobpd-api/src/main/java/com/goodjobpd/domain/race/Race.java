package com.goodjobpd.domain.race;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "races")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Race {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private RaceStatus status;

    @Column(nullable = false)
    private Integer targetCnt;

    /**
     * 사용자당 하루에 등록 가능한 최대 포도알 수 (기본 2)
     */
    @Column(nullable = false)
    private Integer dailyLimit;

    private LocalDateTime createdAt;
    private LocalDateTime startedAt;
    private LocalDateTime endedAt;

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = RaceStatus.READY;
        }
        if (this.targetCnt == null) {
            this.targetCnt = 30;
        }
        if (this.dailyLimit == null) {
            this.dailyLimit = 2;
        }
    }
}
