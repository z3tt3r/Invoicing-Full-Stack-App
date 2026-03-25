package cz.z3tt3r.invoicing.entity.repository;

import cz.z3tt3r.invoicing.entity.AppUserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AppUserRepository extends JpaRepository<AppUserEntity, Long> {
    Optional<AppUserEntity> findByEmail(String email);

    Optional<AppUserEntity> findFirstByRoleOrderByIdAsc(cz.z3tt3r.invoicing.entity.UserRole role);

    boolean existsByEmail(String email);

    boolean existsByEmailAndIdNot(String email, Long id);

    long countByRole(cz.z3tt3r.invoicing.entity.UserRole role);
}
