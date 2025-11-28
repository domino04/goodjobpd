package com.goodjobpd.web.user;

import com.goodjobpd.domain.user.User;
import com.goodjobpd.service.UserService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    @GetMapping("/{id}")
    public UserResponse get(@PathVariable Long id) {
        User user = userService.getUser(id);
        return UserResponse.from(user);
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
