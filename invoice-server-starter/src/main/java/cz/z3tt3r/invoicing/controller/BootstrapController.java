package cz.z3tt3r.invoicing.controller;

import cz.z3tt3r.invoicing.dto.BootstrapAdminRequest;
import cz.z3tt3r.invoicing.dto.BootstrapStatusDTO;
import cz.z3tt3r.invoicing.dto.UserDTO;
import cz.z3tt3r.invoicing.service.BootstrapService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/setup")
public class BootstrapController {

    private final BootstrapService bootstrapService;

    public BootstrapController(BootstrapService bootstrapService) {
        this.bootstrapService = bootstrapService;
    }

    @GetMapping("/status")
    public BootstrapStatusDTO getStatus() {
        return bootstrapService.getStatus();
    }

    @PostMapping("/bootstrap-admin")
    @ResponseStatus(HttpStatus.CREATED)
    public UserDTO bootstrapAdmin(@Valid @RequestBody BootstrapAdminRequest request) {
        return bootstrapService.bootstrapAdmin(request);
    }
}
