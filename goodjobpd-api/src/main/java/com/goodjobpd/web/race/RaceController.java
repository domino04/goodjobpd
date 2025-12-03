package com.goodjobpd.web.race;

import com.goodjobpd.domain.race.Race;
import com.goodjobpd.domain.race.RaceMember;
import com.goodjobpd.service.RaceService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/races")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RaceController {

    private final RaceService raceService;

    @PostMapping
    public RaceResponse create(@RequestBody RaceCreateRequest request) {
        Race race = raceService.createRace(
                request.getName(),
                request.getTargetCnt(),
                request.getDailyLimit(),
                request.getUserId()
        );
        return RaceResponse.from(race);
    }

    @GetMapping("/{id}")
    public RaceResponse get(@PathVariable Long id) {
        Race race = raceService.getRace(id);
        return RaceResponse.from(race);
    }

    @GetMapping
    public List<RaceResponse> list() {
        return raceService.listRaces().stream()
                .map(RaceResponse::from)
                .toList();
    }

    @PostMapping("/{raceId}/join")
    public RaceMemberResponse join(@PathVariable Long raceId, @RequestBody JoinRaceRequest request) {
        RaceMember member = raceService.joinRace(raceId, request.getUserId());
        return RaceMemberResponse.from(member);
    }

    @GetMapping("/{raceId}/ranking")
    public List<RaceRankingResponse> ranking(@PathVariable Long raceId) {
        return raceService.getRanking(raceId).stream()
                .map(r -> {
                    RaceRankingResponse res = new RaceRankingResponse();
                    res.setUserId(r.userId());
                    res.setNickname(r.nickname());
                    res.setGrapeCount(r.grapeCount());
                    res.setWinner(r.winner());
                    return res;
                })
                .toList();
    }

    @PostMapping("/{raceId}/close")
    public RaceResponse close(@PathVariable Long raceId, @RequestBody OwnerRequest request) {
        Race race = raceService.closeRace(raceId, request.getUserId());
        return RaceResponse.from(race);
    }

    @PostMapping("/{raceId}/reopen")
    public RaceResponse reopen(@PathVariable Long raceId, @RequestBody OwnerRequest request) {
        Race race = raceService.reopenRace(raceId, request.getUserId());
        return RaceResponse.from(race);
    }

    @Data
    public static class OwnerRequest {
        private Long userId;
    }

    @Data
    public static class RaceCreateRequest {
        private String name;
        private Integer targetCnt;
        private Integer dailyLimit;
        private Long userId;
    }

    @Data
    public static class RaceResponse {
        private Long id;
        private String name;
        private String status;
        private Integer targetCnt;
        private Integer dailyLimit;
        private Long createdById;
        private String createdByNickname;

        public static RaceResponse from(Race race) {
            RaceResponse res = new RaceResponse();
            res.setId(race.getId());
            res.setName(race.getName());
            res.setStatus(race.getStatus().name());
            res.setTargetCnt(race.getTargetCnt());
            res.setDailyLimit(race.getDailyLimit());
            if (race.getCreatedBy() != null) {
                res.setCreatedById(race.getCreatedBy().getId());
                res.setCreatedByNickname(race.getCreatedBy().getNickname());
            }

            return res;
        }
    }

    @Data
    public static class JoinRaceRequest {
        private Long userId;
    }

    @Data
    public static class RaceMemberResponse {
        private Long id;
        private Long raceId;
        private Long userId;
        private Integer grapeCount;
        private boolean winner;

        public static RaceMemberResponse from(RaceMember member) {
            RaceMemberResponse res = new RaceMemberResponse();
            res.setId(member.getId());
            res.setRaceId(member.getRace().getId());
            res.setUserId(member.getUser().getId());
            res.setGrapeCount(member.getGrapeCount());
            res.setWinner(member.getWinner() != null && member.getWinner());
            return res;
        }
    }

    @Data
    public static class RaceRankingResponse {
        private Long userId;
        private String nickname;
        private Integer grapeCount;
        private boolean winner;
    }
}
