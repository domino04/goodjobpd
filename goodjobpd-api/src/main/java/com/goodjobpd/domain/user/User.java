package com.goodjobpd.domain.user;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 로그인 ID (이메일 또는 별명 형태)
     */
    @Column(nullable = false, unique = true, length = 50)
    private String loginId;

    /**
     * 비밀번호 (데모용으로 평문 저장 - 실제 서비스에서는 반드시 해시 처리 필요)
     */
    @Column(nullable = false, length = 100)
    private String password;

    /**
     * 화면에 표시되는 닉네임
     */
    @Column(nullable = false, length = 50)
    private String nickname;

    @Column(length = 255)
    private String avatarUrl;

    private LocalDateTime createdAt;

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}