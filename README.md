# MCVSync
 
MCVSync is a centralized inventory and order management system designed for MCVSIX Enterprises Corporation, a medical distribution company. It streamlines inventory monitoring, purchasing, sales, inter-branch transfers, and client order management through a modern Progressive Web Application architecture.
 
## Project Overview
 
MCVSIX distributes diagnostic machines, laboratory equipment, and medical reagents to healthcare facilities across the Philippines, operating out of a main branch (Apalit, Pampanga) plus regional branches in Cebu and Davao. Its current process runs on spreadsheets, paper documents, and informal channels like Messenger and Viber — which leads to missed orders, stock inconsistencies, and no real-time visibility across departments or branches.
 
MCVSync replaces that with a single system spanning six internal roles (Sales, Purchasing, Accounting, Logistics, Admin, Super Admin/CEO) and an external Client Portal, connected by a shared data model rather than disconnected spreadsheets.
 
Core capabilities:
- **FEFO-enforced stock allocation** — batches are released strictly by nearest expiry date, not by physical shelf order
- **Client Order Form (COF) pipeline** — client orders (from the portal or manual channels) become a standardized internal document, priced per client+item, and tracked through a defined status pipeline from intake to delivery confirmation
- **Inter-branch stock transfers** — request/fulfill/receive-and-confirm workflow between branches, using the same scan-and-match mechanics as client fulfillment
- **Per-client, per-item pricing and discounting** — pricing is owned by Accounting, discounting by Sales, tracked independently
- **Role-based access control** — every role sees and can do only what its function requires, enforced server-side
- **Real-time, offline-capable PWA** — usable across devices, stays functional without a connection, syncs once restored
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
 
