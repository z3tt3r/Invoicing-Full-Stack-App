package cz.z3tt3r.invoicing.dto;

import cz.z3tt3r.invoicing.entity.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateUserRequest {

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String fullName;

    @NotNull
    private UserRole role;

    @NotBlank
    @Size(min = 8, message = "Heslo musí mít alespoň 8 znaků.")
    private String password;
}
