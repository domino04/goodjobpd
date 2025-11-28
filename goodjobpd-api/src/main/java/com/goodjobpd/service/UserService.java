package com.goodjobpd.service;

import com.goodjobpd.domain.user.User;
import com.goodjobpd.domain.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;

    public User signUp(String loginId, String rawPassword, String nickname, String avatarUrl) {
        userRepository.findByLoginId(loginId).ifPresent(u -> {
            throw new IllegalArgumentException("이미 사용 중인 로그인 ID 입니다: " + loginId);
        });

        User user = User.builder()
                .loginId(loginId)
                .password(rawPassword) // 실제 서비스에서는 반드시 암호화해야 함
                .nickname(nickname)
                .avatarUrl(avatarUrl)
                .build();
        return userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public User login(String loginId, String rawPassword) {
        User user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new IllegalArgumentException("해당 로그인 ID를 가진 사용자가 없습니다."));

        if (!user.getPassword().equals(rawPassword)) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }
        return user;
    }

    @Transactional(readOnly = true)
    public User getUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + id));
    }
}
