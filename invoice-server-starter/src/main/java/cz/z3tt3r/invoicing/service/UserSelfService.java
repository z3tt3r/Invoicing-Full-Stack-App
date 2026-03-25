package cz.z3tt3r.invoicing.service;

import cz.z3tt3r.invoicing.dto.ChangeOwnPasswordRequest;
import cz.z3tt3r.invoicing.entity.AppUserEntity;
import cz.z3tt3r.invoicing.entity.repository.AppUserRepository;
import cz.z3tt3r.invoicing.security.CurrentUserService;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserSelfService {

    private final CurrentUserService currentUserService;
    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;

    public UserSelfService(CurrentUserService currentUserService, AppUserRepository appUserRepository, PasswordEncoder passwordEncoder) {
        this.currentUserService = currentUserService;
        this.appUserRepository = appUserRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void changeOwnPassword(ChangeOwnPasswordRequest request) {
        AppUserEntity currentUser = currentUserService.getCurrentUser();

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nové heslo a potvrzení hesla se neshodují.");
        }

        if (!passwordEncoder.matches(request.getCurrentPassword(), currentUser.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Aktuální heslo není správné.");
        }

        currentUser.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        appUserRepository.save(currentUser);
    }
}
