# Invoicing Full-Stack App

Modern full-stack invoicing application built with Spring Boot and React.

This project started as a CRUD invoicing app and now includes session-based authentication, role-based access control, first-run admin bootstrap, and scoped access to invoices and statistics.

> Screenshot placeholder: overview / login screen

## Overview

The application consists of:

- `invoice-server-starter/`: Spring Boot REST API with MySQL persistence
- `invoice-client-starter/`: React + Vite frontend

Main capabilities:

- user authentication with server-side sessions
- one-time bootstrap flow for the first administrator
- admin and regular user roles
- shared person directory
- invoice ownership rules
- admin-only statistics
- admin UI for user management
- self-service password change for all users

## Tech Stack

### Backend

- Java 17
- Spring Boot 3
- Spring Data JPA
- Spring Security
- MySQL
- MapStruct
- Bean Validation
- springdoc OpenAPI / Swagger UI

### Frontend

- React 18
- React Router
- Vite
- Bootstrap 5

## Project Structure

```text
invoicing/
├── invoice-server-starter/
│   ├── pom.xml
│   └── src/
├── invoice-client-starter/
│   ├── package.json
│   └── src/
└── docs/
    └── screens/
```

## Authentication And Roles

The application uses session-based authentication with Spring Security.

Roles:

- `ROLE_ADMIN`
- `ROLE_USER`

Current access rules:

- all API routes require authentication unless explicitly public
- first-run setup endpoints are public only while no users exist
- user management is admin-only
- statistics are admin-only
- all authenticated users can view persons
- all authenticated users can create persons
- only admins can edit or delete persons
- invoices are visible to their owner and to admins
- invoices can be created by any authenticated user
- invoices can be edited or deleted only by their owner or an admin
- all users can change their own password
- admins can create users and reset credentials for other users

Passwords are stored as BCrypt hashes. BCrypt includes per-password salting automatically.

## First-Run Setup

This app no longer ships with a permanent seeded admin account.

When the database contains no users:

1. open the frontend
2. you will be redirected to the setup page
3. create the first administrator
4. sign in with that new account

For local development, the setup page also shows a dummy example credential pair. That example is only a hint for testing the form and is configurable through environment variables.

## Running Locally

### Prerequisites

- Java 17+
- Node.js 18+
- MySQL running locally

### Backend

Configuration is currently in [invoice-server-starter/src/main/resources/application.yaml](./invoice-server-starter/src/main/resources/application.yaml).

Default local settings:

- backend port: `8080`
- database: `jdbc:mysql://localhost/InvoiceDatabase`
- frontend origin allowed by CORS: `http://localhost:5173`

Run the backend:

```bash
cd invoice-server-starter
mvn spring-boot:run
```

Backend URLs:

- API: [http://localhost:8080](http://localhost:8080)
- Swagger UI: [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)

### Frontend

Run the frontend:

```bash
cd invoice-client-starter
npm install
npm run dev
```

Frontend URL:

- App: [http://localhost:5173](http://localhost:5173)

## Database And Seed Data

The current development configuration is intentionally development-oriented:

- JPA uses `create-drop`
- `data.sql` is executed on startup
- persons and invoices are seeded for local testing
- users are not seeded permanently

Important note:

- because `create-drop` is enabled, application data is recreated on restart in the current development setup

If you want a more persistent local or production-like setup later, switch Hibernate away from `create-drop` and revisit SQL initialization strategy.

## User Flows

### Admin

Admins can:

- create and manage users
- reset passwords for other users
- access statistics
- edit and delete persons
- view and manage all invoices

### Regular User

Regular users can:

- sign in
- change their own password
- view all persons
- create persons
- create invoices
- view and manage only their own invoices

When a regular user sees a person detail or edit area, the UI shows that person updates must be handled by an administrator and displays the primary admin contact email.

## API Areas

High-level backend route groups:

- `/api/setup/*`: first-run bootstrap setup
- `/api/auth/*`: login, logout, current session
- `/api/account/*`: self-service account actions
- `/api/admin/users/*`: admin user management
- `/api/persons/*`: person CRUD and lookup
- `/api/invoices/*`: invoice CRUD, summaries, filtering, statistics

## Testing

### Backend

Current backend verification:

```bash
cd invoice-server-starter
mvn test
```

The repository currently includes a smoke test that verifies the Spring Boot application context loads.

### Frontend

Current frontend verification:

```bash
cd invoice-client-starter
npm run build
```

There are currently no automated frontend tests in the repository.

## Development Notes

- the frontend uses Vite, not Create React App
- the app relies on session cookies, so frontend and backend origin configuration matters
- CORS is configurable with `APP_FRONTEND_URL`
- bootstrap demo values are configurable with:
  - `APP_BOOTSTRAP_DEMO_EMAIL`
  - `APP_BOOTSTRAP_DEMO_PASSWORD`

## Screenshots

Replace the placeholders below once the updated UI captures are ready.

### Screenshot Placeholder: Login

> Add updated login screenshot here.

### Screenshot Placeholder: First-Run Setup

> Add updated first-run setup screenshot here.

### Screenshot Placeholder: Persons

> Add updated persons screen screenshot here.

### Screenshot Placeholder: Invoices

> Add updated invoices screen screenshot here.

### Screenshot Placeholder: Admin User Management

> Add updated admin user management screenshot here.

### Screenshot Placeholder: Statistics

> Add updated statistics screenshot here.

## License

This project is licensed under the [MIT License](./LICENSE).

Created by Michal "Z3TT3R" Musil.
