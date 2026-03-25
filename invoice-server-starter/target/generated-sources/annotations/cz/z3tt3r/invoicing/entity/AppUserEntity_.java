package cz.z3tt3r.invoicing.entity;

import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import javax.annotation.processing.Generated;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(AppUserEntity.class)
public abstract class AppUserEntity_ {

	public static volatile SingularAttribute<AppUserEntity, UserRole> role;
	public static volatile SingularAttribute<AppUserEntity, String> fullName;
	public static volatile SingularAttribute<AppUserEntity, Long> id;
	public static volatile SingularAttribute<AppUserEntity, String> email;
	public static volatile SingularAttribute<AppUserEntity, String> passwordHash;

	public static final String ROLE = "role";
	public static final String FULL_NAME = "fullName";
	public static final String ID = "id";
	public static final String EMAIL = "email";
	public static final String PASSWORD_HASH = "passwordHash";

}

