# BuySimply Fullstack Application

This project consists of a NestJS backend and a Vue 3 frontend for loan management.

## Tech Stack
- **Backend**: NestJS, PostgreSQL, Drizzle ORM, JWT, Swagger.
- **Frontend**: Vue 3, Vite, Tailwind CSS, Pinia, Vee-Validate, Yup, Axios.

## Prerequisites
- Node.js (v18+)
- PostgreSQL database

## Setup

### Backend
1. `cd backend`
2. `npm install`
3. Configure `.env` file with your database credentials.
4. Run migrations/seed: (Automatic on startup for first run)
5. `npm run dev`
6. Access API docs at `http://localhost:3000/docs`

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`
4. Access app at `http://localhost:5173`

## Features
- **Authentication**: JWT based login/logout.
- **Authorization**: Role-based access (Staff, Admin, Superadmin).
- **Loan Management**:
  - Staff: View loans (Sensitive `totalLoan` hidden).
  - Admin: View all loan details.
  - Superadmin: View all details + Delete loans.
- **Filtering**: Filter loans by status (Pending/Active).
- **Seeding**: Automatically seeds staff and loans from JSON files on first boot.

## Design
The frontend features a premium, responsive design with glassmorphism, dark mode, and smooth transitions using Tailwind CSS and Lucide icons.
