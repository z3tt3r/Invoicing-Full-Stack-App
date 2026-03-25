package cz.z3tt3r.invoicing.dto;

import cz.z3tt3r.invoicing.entity.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String email;
    private String fullName;
    private UserRole role;
}
