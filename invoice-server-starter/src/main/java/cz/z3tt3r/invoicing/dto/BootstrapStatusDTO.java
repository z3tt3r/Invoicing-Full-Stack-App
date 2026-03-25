package cz.z3tt3r.invoicing.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BootstrapStatusDTO {
    private boolean setupRequired;
    private String primaryAdminEmail;
    private String demoEmail;
    private String demoPassword;
}
