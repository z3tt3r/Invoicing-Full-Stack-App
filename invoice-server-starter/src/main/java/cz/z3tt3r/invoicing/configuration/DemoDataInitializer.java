package cz.z3tt3r.invoicing.configuration;

import cz.z3tt3r.invoicing.entity.AppUserEntity;
import cz.z3tt3r.invoicing.entity.InvoiceEntity;
import cz.z3tt3r.invoicing.entity.PersonEntity;
import cz.z3tt3r.invoicing.entity.UserRole;
import cz.z3tt3r.invoicing.entity.repository.AppUserRepository;
import cz.z3tt3r.invoicing.entity.repository.InvoiceRepository;
import cz.z3tt3r.invoicing.entity.repository.PersonRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DemoDataInitializer implements CommandLineRunner {

    private final AppUserRepository appUserRepository;
    private final PersonRepository personRepository;
    private final InvoiceRepository invoiceRepository;
    private final PasswordEncoder passwordEncoder;
    private final String adminEmail;
    private final String adminPassword;
    private final String adminName;

    public DemoDataInitializer(
            AppUserRepository appUserRepository,
            PersonRepository personRepository,
            InvoiceRepository invoiceRepository,
            PasswordEncoder passwordEncoder,
            @Value("${app.bootstrap.admin-email}") String adminEmail,
            @Value("${app.bootstrap.admin-password}") String adminPassword,
            @Value("${app.bootstrap.admin-name}") String adminName) {
        this.appUserRepository = appUserRepository;
        this.personRepository = personRepository;
        this.invoiceRepository = invoiceRepository;
        this.passwordEncoder = passwordEncoder;
        this.adminEmail = adminEmail;
        this.adminPassword = adminPassword;
        this.adminName = adminName;
    }

    @Override
    @Transactional
    public void run(String... args) {
        AppUserEntity adminUser = appUserRepository.findByEmail(adminEmail)
                .orElseGet(this::createDefaultAdmin);

        List<PersonEntity> unownedPersons = personRepository.findAllByOwnerIsNull();
        for (PersonEntity person : unownedPersons) {
            person.setOwner(adminUser);
        }
        personRepository.saveAll(unownedPersons);

        List<InvoiceEntity> unownedInvoices = invoiceRepository.findAllByOwnerIsNull();
        for (InvoiceEntity invoice : unownedInvoices) {
            invoice.setOwner(adminUser);
        }
        invoiceRepository.saveAll(unownedInvoices);
    }

    private AppUserEntity createDefaultAdmin() {
        AppUserEntity user = new AppUserEntity();
        user.setEmail(adminEmail);
        user.setPasswordHash(passwordEncoder.encode(adminPassword));
        user.setFullName(adminName);
        user.setRole(UserRole.ROLE_ADMIN);
        return appUserRepository.save(user);
    }
}
