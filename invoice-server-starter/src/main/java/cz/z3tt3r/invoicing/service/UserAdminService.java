package cz.z3tt3r.invoicing.service;

import cz.z3tt3r.invoicing.dto.AdminSetPasswordRequest;
import cz.z3tt3r.invoicing.dto.CreateUserRequest;
import cz.z3tt3r.invoicing.dto.UpdateUserRequest;
import cz.z3tt3r.invoicing.dto.UserDTO;
import cz.z3tt3r.invoicing.entity.AppUserEntity;
import cz.z3tt3r.invoicing.entity.UserRole;
import cz.z3tt3r.invoicing.entity.repository.AppUserRepository;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class UserAdminService {

    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;

    public UserAdminService(AppUserRepository appUserRepository, PasswordEncoder passwordEncoder) {
        this.appUserRepository = appUserRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<UserDTO> getUsers() {
        return appUserRepository.findAll(Sort.by("fullName").ascending())
                .stream()
                .map(this::toDto)
                .toList();
    }

    public UserDTO getUser(Long userId) {
        return toDto(fetchUser(userId));
    }

    public UserDTO createUser(CreateUserRequest request) {
        validateUniqueEmail(request.getEmail(), null);

        AppUserEntity user = new AppUserEntity();
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setFullName(request.getFullName().trim());
        user.setRole(request.getRole());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));

        return toDto(appUserRepository.save(user));
    }

    public UserDTO updateUser(Long userId, UpdateUserRequest request) {
        AppUserEntity user = fetchUser(userId);
        validateUniqueEmail(request.getEmail(), userId);
        validateLastAdminProtection(user, request.getRole());

        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setFullName(request.getFullName().trim());
        user.setRole(request.getRole());

        return toDto(appUserRepository.save(user));
    }

    public void setPassword(Long userId, AdminSetPasswordRequest request) {
        AppUserEntity user = fetchUser(userId);
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        appUserRepository.save(user);
    }

    private AppUserEntity fetchUser(Long userId) {
        return appUserRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Uživatel nebyl nalezen."));
    }

    private void validateUniqueEmail(String email, Long userId) {
        String normalizedEmail = email.trim().toLowerCase();
        boolean exists = userId == null
                ? appUserRepository.existsByEmail(normalizedEmail)
                : appUserRepository.existsByEmailAndIdNot(normalizedEmail, userId);

        if (exists) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Uživatel s tímto e-mailem již existuje.");
        }
    }

    private void validateLastAdminProtection(AppUserEntity currentUser, UserRole newRole) {
        if (currentUser.getRole() == UserRole.ROLE_ADMIN
                && newRole != UserRole.ROLE_ADMIN
                && appUserRepository.countByRole(UserRole.ROLE_ADMIN) <= 1) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Posledního administrátora nelze změnit na běžného uživatele.");
        }
    }

    private UserDTO toDto(AppUserEntity user) {
        return new UserDTO(user.getId(), user.getEmail(), user.getFullName(), user.getRole());
    }
}
