package com.goodjobpd.web.grape;

import com.goodjobpd.domain.grape.GrapeDeleteLog;
import com.goodjobpd.domain.grape.GrapeLog;
import com.goodjobpd.domain.grape.GrapeType;
import com.goodjobpd.service.GrapeService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class GrapeController {

    private final GrapeService grapeService;

    @PostMapping("/grapes")
    public GrapeResponse add(@RequestBody GrapeCreateRequest request) {
        LocalDateTime activityTime = null;
        if (request.getActivityTime() != null && !request.getActivityTime().isBlank()) {
            activityTime = LocalDateTime.parse(request.getActivityTime());
        }

        GrapeLog log = grapeService.addGrape(
                request.getUserId(),
                request.getRaceId(),
                GrapeType.valueOf(request.getType()),
                request.getMinutes(),
                request.getDescription(),
                request.getImageUrl(),
                activityTime
        );
        return GrapeResponse.from(log);
    }

    @GetMapping("/users/{userId}/grapes")
    public List<GrapeResponse> userGrapes(@PathVariable Long userId, @RequestParam Long raceId) {
        return grapeService.getUserGrapes(userId, raceId).stream()
                .map(GrapeResponse::from)
                .toList();
    }

    /**
     * 자신의 포도알 삭제 API
     * userId는 쿼리 파라미터로 전달
     */
    @DeleteMapping("/grapes/{id}")
    public void delete(@PathVariable Long id, @RequestParam Long userId) {
        grapeService.deleteGrape(id, userId);
    }

    /**
     * 사용자별 삭제 이력 조회
     */
    @GetMapping("/users/{userId}/grapes/deleted")
    public List<GrapeDeleteResponse> userDeletedGrapes(@PathVariable Long userId, @RequestParam Long raceId) {
        return grapeService.getUserDeletedGrapes(userId, raceId).stream()
                .map(GrapeDeleteResponse::from)
                .toList();
    }

    // --- DTOs ---

    @Data
    public static class GrapeCreateRequest {
        private Long userId;
        private Long raceId;
        private String type; // WORKOUT or DIET
        private Integer minutes;
        private String description;
        private String imageUrl;
        private String activityTime; // ISO-8601 (yyyy-MM-dd'T'HH:mm)
    }

    @Data
    public static class GrapeResponse {
        private Long id;
        private Long userId;
        private Long raceId;
        private String type;
        private Integer minutes;
        private String description;
        private String imageUrl;
        private String createdAt;    // 활동 시점 기준
        private String activityTime;

        public static GrapeResponse from(GrapeLog log) {
            GrapeResponse res = new GrapeResponse();
            res.setId(log.getId());
            res.setUserId(log.getUser().getId());
            res.setRaceId(log.getRace().getId());
            res.setType(log.getType().name());
            res.setMinutes(log.getMinutes());
            res.setDescription(log.getDescription());
            res.setImageUrl(log.getImageUrl());
            if (log.getActivityTime() != null) {
                res.setActivityTime(log.getActivityTime().toString());
                res.setCreatedAt(log.getActivityTime().toString());
            } else if (log.getCreatedAt() != null) {
                res.setCreatedAt(log.getCreatedAt().toString());
            }
            return res;
        }
    }

    @Data
    public static class GrapeDeleteResponse {
        private Long id;
        private Long userId;
        private Long raceId;
        private String type;
        private Integer minutes;
        private String description;
        private String imageUrl;
        private String activityTime;
        private String deletedAt;
        private Long originalLogId;

        public static GrapeDeleteResponse from(GrapeDeleteLog log) {
            GrapeDeleteResponse res = new GrapeDeleteResponse();
            res.setId(log.getId());
            res.setUserId(log.getUser().getId());
            res.setRaceId(log.getRace().getId());
            res.setType(log.getType().name());
            res.setMinutes(log.getMinutes());
            res.setDescription(log.getDescription());
            res.setImageUrl(log.getImageUrl());
            if (log.getActivityTime() != null) {
                res.setActivityTime(log.getActivityTime().toString());
            }
            if (log.getDeletedAt() != null) {
                res.setDeletedAt(log.getDeletedAt().toString());
            }
            res.setOriginalLogId(log.getOriginalLogId());
            return res;
        }
    }
}
