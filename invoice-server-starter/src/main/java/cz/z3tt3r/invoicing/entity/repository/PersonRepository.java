package cz.z3tt3r.invoicing.entity.repository;

import cz.z3tt3r.invoicing.dto.PersonStatisticsDTO;
import cz.z3tt3r.invoicing.entity.PersonEntity;
import cz.z3tt3r.invoicing.entity.PersonLookup;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for managing {@link PersonEntity} data.
 * This interface provides methods for CRUD operations and custom queries
 * related to person entities.
 */
@Repository
public interface PersonRepository extends JpaRepository<PersonEntity, Long> {

    /**
     * Retrieves all persons based on their hidden status.
     *
     * @param hidden The hidden status to filter by.
     * @return A list of {@link PersonEntity} objects.
     */
    List<PersonEntity> findByHiddenAndOwner_Id(boolean hidden, Long ownerId);

    /**
     * Retrieves a paginated list of {@link PersonLookup} objects based on their hidden status.
     *
     * @param hidden The hidden status to filter by.
     * @param pageable The pagination information.
     * @return A page of {@link PersonLookup} objects.
     */
    Page<PersonLookup> findByHiddenAndOwner_Id(boolean hidden, Long ownerId, Pageable pageable);

    /**
     * Finds a list of persons by their identification number.
     *
     * @param identificationNumber The identification number to search for.
     * @return A list of {@link PersonEntity} objects.
     */
    List<PersonEntity> findByIdentificationNumberAndOwner_Id(String identificationNumber, Long ownerId);

    /**
     * Retrieves a list of all persons that are not hidden.
     *
     * @return A list of {@link PersonLookup} objects.
     */
    List<PersonLookup> findAllByHiddenFalseAndOwner_Id(Long ownerId);

    Optional<PersonEntity> findByIdAndOwner_Id(Long id, Long ownerId);

    List<PersonEntity> findAllByOwnerIsNull();

    /**
     * Retrieves a paginated list of person statistics, including total revenue.
     * Revenue is calculated by summing the prices of all sales and purchases
     * for each non-hidden person.
     *
     * @param pageable The pagination information.
     * @return A page of {@link PersonStatisticsDTO} objects.
     */
    @Query(value = "SELECT new cz.z3tt3r.invoicing.dto.PersonStatisticsDTO(" +
            "p.id AS personId, " +
            "p.name AS personName, " +
            "COALESCE(SUM(CASE WHEN sell_inv.hidden = FALSE THEN sell_inv.price ELSE 0 END), 0) + " +
            "COALESCE(SUM(CASE WHEN buy_inv.hidden = FALSE THEN buy_inv.price ELSE 0 END), 0) AS revenue) " +
            "FROM person p " +
            "LEFT JOIN p.sales sell_inv " +
            "LEFT JOIN p.purchases buy_inv " +
            "WHERE p.hidden = FALSE AND p.owner.id = :ownerId " +
            "GROUP BY p.id, p.name " +
            "ORDER BY p.id")
    Page<PersonStatisticsDTO> getPersonRevenueStatistics(@Param("ownerId") Long ownerId, Pageable pageable);
}
