# MCVSync

MCVSync is a centralized inventory and order management system designed for MCVSIX Enterprises Corporation. It streamlines inventory monitoring, purchasing, sales, inter-branch transfers, and client order management through a modern Progressive Web Application architecture.

## Repository Structure
This repository follows a **monorepo** structure where all applications are maintained in a single repository while remaining independent.

```
mcvsync/
├── api/          # Laravel REST API
├── app/          # React Application (Internal Management System)
└── portal/       # React Application (Client Ordering Portal)
```

## Applications

### `api/`
The backend service built with **Laravel**. It provides RESTful APIs for authentication, inventory management, purchasing, sales, client orders, reporting, and other business operations.

### `app/`
The internal **React** application used by MCVSIX employees, including administrators, executives, purchasing, sales, accounting, and logistics personnel.

### `portal/`
The **React** client-facing application where authorized clients can submit purchase orders, track order status, and view their transaction history.