package cz.z3tt3r.invoicing.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AdminSetPasswordRequest {

    @NotBlank
    @Size(min = 8, message = "Heslo musí mít alespoň 8 znaků.")
    private String newPassword;
}
