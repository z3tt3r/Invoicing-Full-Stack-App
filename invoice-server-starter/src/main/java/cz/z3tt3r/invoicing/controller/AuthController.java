package cz.z3tt3r.invoicing.controller;

import cz.z3tt3r.invoicing.dto.AuthLoginRequest;
import cz.z3tt3r.invoicing.dto.AuthUserDTO;
import cz.z3tt3r.invoicing.entity.AppUserEntity;
import cz.z3tt3r.invoicing.entity.UserRole;
import cz.z3tt3r.invoicing.entity.repository.AppUserRepository;
import cz.z3tt3r.invoicing.security.CurrentUserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final CurrentUserService currentUserService;
    private final AppUserRepository appUserRepository;

    public AuthController(
            AuthenticationManager authenticationManager,
            CurrentUserService currentUserService,
            AppUserRepository appUserRepository) {
        this.authenticationManager = authenticationManager;
        this.currentUserService = currentUserService;
        this.appUserRepository = appUserRepository;
    }

    @PostMapping("/login")
    public AuthUserDTO login(
            @Valid @RequestBody AuthLoginRequest request,
            HttpServletRequest httpServletRequest,
            HttpServletResponse httpServletResponse) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    UsernamePasswordAuthenticationToken.unauthenticated(request.getEmail(), request.getPassword()));

            SecurityContext context = SecurityContextHolder.createEmptyContext();
            context.setAuthentication(authentication);
            SecurityContextHolder.setContext(context);

            HttpSession session = httpServletRequest.getSession(true);
            session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, context);

            return toAuthUserDto(currentUserService.getCurrentUser());
        } catch (BadCredentialsException exception) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Neplatný e-mail nebo heslo.");
        }
    }

    @GetMapping("/me")
    public AuthUserDTO me() {
        return toAuthUserDto(currentUserService.getCurrentUser());
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(Authentication authentication, HttpServletRequest request, HttpServletResponse response) {
        new SecurityContextLogoutHandler().logout(request, response, authentication);
    }

    private AuthUserDTO toAuthUserDto(AppUserEntity user) {
        String primaryAdminEmail = appUserRepository.findFirstByRoleOrderByIdAsc(UserRole.ROLE_ADMIN)
                .map(AppUserEntity::getEmail)
                .orElse(null);
        return new AuthUserDTO(user.getId(), user.getEmail(), user.getFullName(), user.getRole(), primaryAdminEmail);
    }
}
