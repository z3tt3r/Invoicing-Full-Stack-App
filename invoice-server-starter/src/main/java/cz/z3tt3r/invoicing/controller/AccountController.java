package cz.z3tt3r.invoicing.controller;

import cz.z3tt3r.invoicing.dto.ChangeOwnPasswordRequest;
import cz.z3tt3r.invoicing.service.UserSelfService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/account")
public class AccountController {

    private final UserSelfService userSelfService;

    public AccountController(UserSelfService userSelfService) {
        this.userSelfService = userSelfService;
    }

    @PutMapping("/password")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void changeOwnPassword(
            @Valid @RequestBody ChangeOwnPasswordRequest request,
            Authentication authentication,
            HttpServletRequest httpServletRequest,
            HttpServletResponse httpServletResponse) {
        userSelfService.changeOwnPassword(request);
        new SecurityContextLogoutHandler().logout(httpServletRequest, httpServletResponse, authentication);
    }
}
