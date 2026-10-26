package com.quickbite.controller;

import com.quickbite.auth.StaffTokenService;
import com.quickbite.dto.DsaResponses.HashView;
import com.quickbite.dto.DsaResponses.PriorityView;
import com.quickbite.dto.DsaResponses.ProcessNextView;
import com.quickbite.dto.DsaResponses.QueueView;
import com.quickbite.dto.DsaResponses.SearchView;
import com.quickbite.dto.DsaResponses.SortView;
import com.quickbite.service.DataStructuresService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Staff-only endpoints behind the "Data Structures" and "Search & Sort" pages.
 * Each one runs a com.quickbite.dsa structure over the signed-in staff member's
 * canteen and returns the result.
 */
@RestController
@RequestMapping("/api/dsa")
public class DataStructuresController {

    private static final String AUTH = "Authorization";

    private final DataStructuresService service;
    private final StaffTokenService tokens;

    public DataStructuresController(DataStructuresService service, StaffTokenService tokens) {
        this.service = service;
        this.tokens = tokens;
    }

    @GetMapping("/queue")
    public QueueView queue(@RequestHeader(value = AUTH, required = false) String auth) {
        return service.queue(tokens.requireStaff(auth).canteenId());
    }

    /** Dequeues the front order and moves it to Processing. */
    @PostMapping("/queue/process-next")
    public ProcessNextView processNext(@RequestHeader(value = AUTH, required = false) String auth) {
        return service.processNext(tokens.requireStaff(auth).canteenId());
    }

    @GetMapping("/priority")
    public PriorityView priority(@RequestHeader(value = AUTH, required = false) String auth) {
        return service.priority(tokens.requireStaff(auth).canteenId());
    }

    @GetMapping("/hash")
    public HashView hash(@RequestParam(required = false) String key,
                         @RequestHeader(value = AUTH, required = false) String auth) {
        return service.hash(tokens.requireStaff(auth).canteenId(), key);
    }

    @GetMapping("/orders/sorted")
    public SortView sorted(@RequestParam(defaultValue = "Time") String by,
                           @RequestParam(defaultValue = "Descending") String dir,
                           @RequestHeader(value = AUTH, required = false) String auth) {
        return service.sort(tokens.requireStaff(auth).canteenId(), by, dir);
    }

    @GetMapping("/orders/search")
    public SearchView search(@RequestParam String q,
                             @RequestHeader(value = AUTH, required = false) String auth) {
        return service.search(tokens.requireStaff(auth).canteenId(), q);
    }
}
