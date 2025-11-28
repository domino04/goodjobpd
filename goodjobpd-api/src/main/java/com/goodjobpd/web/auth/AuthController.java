package com.goodjobpd.web.auth;

import com.goodjobpd.domain.user.User;
import com.goodjobpd.service.UserService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserService userService;

    @PostMapping("/sign-up")
    public UserResponse signUp(@RequestBody SignUpRequest request) {
        User user = userService.signUp(
                request.getLoginId(),
                request.getPassword(),
                request.getNickname(),
                request.getAvatarUrl()
        );
        return UserResponse.from(user);
    }

    @PostMapping("/login")
    public UserResponse login(@RequestBody LoginRequest request) {
        User user = userService.login(request.getLoginId(), request.getPassword());
        return UserResponse.from(user);
    }

    @Data
    public static class SignUpRequest {
        private String loginId;
        private String password;
        private String nickname;
        private String avatarUrl;
    }

    @Data
    public static class LoginRequest {
        private String loginId;
        private String password;
    }

    @Data
    public static class UserResponse {
        private Long id;
        private String loginId;
        private String nickname;
        private String avatarUrl;

        public static UserResponse from(User user) {
            UserResponse res = new UserResponse();
            res.setId(user.getId());
            res.setLoginId(user.getLoginId());
            res.setNickname(user.getNickname());
            res.setAvatarUrl(user.getAvatarUrl());
            return res;
        }
    }
}
