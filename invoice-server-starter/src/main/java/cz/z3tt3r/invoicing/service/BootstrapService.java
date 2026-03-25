package cz.z3tt3r.invoicing.service;

import cz.z3tt3r.invoicing.dto.BootstrapAdminRequest;
import cz.z3tt3r.invoicing.dto.BootstrapStatusDTO;
import cz.z3tt3r.invoicing.dto.UserDTO;
import cz.z3tt3r.invoicing.entity.AppUserEntity;
import cz.z3tt3r.invoicing.entity.InvoiceEntity;
import cz.z3tt3r.invoicing.entity.UserRole;
import cz.z3tt3r.invoicing.entity.repository.AppUserRepository;
import cz.z3tt3r.invoicing.entity.repository.InvoiceRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class BootstrapService {

    private final AppUserRepository appUserRepository;
    private final InvoiceRepository invoiceRepository;
    private final PasswordEncoder passwordEncoder;
    private final String demoEmail;
    private final String demoPassword;

    public BootstrapService(
            AppUserRepository appUserRepository,
            InvoiceRepository invoiceRepository,
            PasswordEncoder passwordEncoder,
            @Value("${app.bootstrap.demo-email}") String demoEmail,
            @Value("${app.bootstrap.demo-password}") String demoPassword) {
        this.appUserRepository = appUserRepository;
        this.invoiceRepository = invoiceRepository;
        this.passwordEncoder = passwordEncoder;
        this.demoEmail = demoEmail;
        this.demoPassword = demoPassword;
    }

    public BootstrapStatusDTO getStatus() {
        boolean setupRequired = appUserRepository.count() == 0;
        String primaryAdminEmail = appUserRepository.findFirstByRoleOrderByIdAsc(UserRole.ROLE_ADMIN)
                .map(AppUserEntity::getEmail)
                .orElse(null);

        return new BootstrapStatusDTO(
                setupRequired,
                primaryAdminEmail,
                setupRequired ? demoEmail : null,
                setupRequired ? demoPassword : null
        );
    }

    @Transactional
    public UserDTO bootstrapAdmin(BootstrapAdminRequest request) {
        if (appUserRepository.count() > 0) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Úvodní nastavení již bylo dokončeno.");
        }

        String normalizedEmail = request.getEmail().trim().toLowerCase();
        if (appUserRepository.existsByEmail(normalizedEmail)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Uživatel s tímto e-mailem již existuje.");
        }

        AppUserEntity adminUser = new AppUserEntity();
        adminUser.setEmail(normalizedEmail);
        adminUser.setFullName(request.getFullName().trim());
        adminUser.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        adminUser.setRole(UserRole.ROLE_ADMIN);
        adminUser = appUserRepository.save(adminUser);

        List<InvoiceEntity> unownedInvoices = invoiceRepository.findAllByOwnerIsNull();
        for (InvoiceEntity invoice : unownedInvoices) {
            invoice.setOwner(adminUser);
        }
        invoiceRepository.saveAll(unownedInvoices);

        return new UserDTO(adminUser.getId(), adminUser.getEmail(), adminUser.getFullName(), adminUser.getRole());
    }
}
