package cz.z3tt3r.invoicing.controller;

import cz.z3tt3r.invoicing.dto.AdminSetPasswordRequest;
import cz.z3tt3r.invoicing.dto.CreateUserRequest;
import cz.z3tt3r.invoicing.dto.UpdateUserRequest;
import cz.z3tt3r.invoicing.dto.UserDTO;
import cz.z3tt3r.invoicing.service.UserAdminService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
public class UserAdminController {

    private final UserAdminService userAdminService;

    public UserAdminController(UserAdminService userAdminService) {
        this.userAdminService = userAdminService;
    }

    @GetMapping
    public List<UserDTO> getUsers() {
        return userAdminService.getUsers();
    }

    @GetMapping("/{userId}")
    public UserDTO getUser(@PathVariable Long userId) {
        return userAdminService.getUser(userId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserDTO createUser(@Valid @RequestBody CreateUserRequest request) {
        return userAdminService.createUser(request);
    }

    @PatchMapping("/{userId}")
    public UserDTO updateUser(@PathVariable Long userId, @Valid @RequestBody UpdateUserRequest request) {
        return userAdminService.updateUser(userId, request);
    }

    @PutMapping("/{userId}/password")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void setPassword(@PathVariable Long userId, @Valid @RequestBody AdminSetPasswordRequest request) {
        userAdminService.setPassword(userId, request);
    }
}
