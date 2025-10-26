![App Preview](./docs/screens/invoices.png)

# 💼 Invoicing Full-Stack Project

A lightweight full-stack invoicing app built with **Spring Boot** and **React**.  
Designed as a clean example of full-stack architecture for portfolio and learning purposes.

---

## 🧭 Overview

| Layer | Stack | Description |
|-------|-------|-------------|
| **Backend** | Java 17 · Spring Boot · JPA · MySQL | REST API for managing people, invoices and statistics |
| **Frontend** | React 18 · Bootstrap | Simple UI for listing and editing invoices |
| **Database** | MySQL (local) | Schema and demo data defined in SQL scripts |

---

## 🗂️ Project structure

```
invoicing-fullstack/
├── invoice-server-starter/     # Spring Boot backend
└── invoice-client-starter/     # React frontend sources (src-fe/)
```

---

## ⚙️ Backend

- **Spring Boot 3 + Spring Data JPA**
- Validation with JSR-380 annotations  
- Mapping via **MapStruct**  
- **Soft delete** using a hidden flag  
- Demo data loaded from `data.sql`  
- OpenAPI docs via `springdoc-openapi` (Swagger UI → `/swagger-ui`)

**Run the backend**

```bash
cd invoice-server-starter
./mvnw spring-boot:run
# or: mvn spring-boot:run
```

API available at [`http://localhost:8080`](http://localhost:8080)

---

## 💻 Frontend

- **React 18** with functional components and hooks  
- **Bootstrap 5** for UI styling  
- Axios-based API helpers in `src-fe/utils/api.js`  
- Simple routing and local state management  

**Run the client (manual setup):**
If not yet configured as an NPM project, run directly in your IDE or add a basic `package.json` with React scripts.

Example:
```bash
cd invoice-client-starter
npm install
npm run dev
```

UI available at [`http://localhost:3000`](http://localhost:3000)

---

## 🧪 Testing

### Backend
A basic smoke test verifies that the Spring Boot application context loads successfully.

```bash
cd invoice-server-starter
./mvnw test
```

### Frontend
No automated frontend tests are currently available.
Planned: add simple smoke tests once a test runner is configured.

---

## 🧰 Development notes

- Java 17+, Node.js 18+ required  
- Keep DTOs and API contracts in sync between backend & frontend  
- Format and lint before committing  
- Semantic commit messages are encouraged (`feat:`, `fix:`, `chore:`)

---

## 🗓️ Changelog

| Version | Changes |
|----------|----------|
| **0.1.0** | Initial setup with working backend & frontend |
| **0.2.0** | Cleanup of unused code, updated README and docs |


---

## 🖼️ Screenshots

### 💰 Invoice List
View of all invoices with filtering, buyers and edit options.

![Invoice List](./docs/screens/invoices.png)

### 📊 Statistics
Summary and detail of statistics and all invoices.

![Statistics](./docs/screens/statistics.png)

### 🧑‍💼 Persons Management
View, editing and deletion of person with confirmation dialog window.

![Delete Person Confirmation](./docs/screens/person-delete.png)

---

## 📄 License

This project is licensed under the **MIT License**.

© 2025 — Created by [Michal "Z3TT3R" Musil].  
Feel free to fork, learn and build upon it.
