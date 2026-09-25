# आई (Aai) — Maternal & Child Care Platform

A full-stack web application for prenatal and postpartum maternal healthcare management built with **React**, **Node.js/Express**, and **MongoDB**.

---

## Features

- **Mother Dashboard** — Log vitals, view prescriptions, manage post-partum care & child details
- **Obstetrician Dashboard** — View patient roster, monitor vitals with interactive graphs, write private notes, manage infant diet plans
- **Maternal Vitals Tracking** — Temperature, heart rate, blood pressure, fetal heart rate, contractions, hemoglobin, urine protein, blood glucose, and more
- **Post-Partum Care** — Automatic activation past due date or manual activation by doctor; add child details, view doctor-prescribed diet plans
- **Vitals Trends Graph** — Interactive line charts (Heart Rate, Fetal HR, Glucose) powered by Recharts
- **PDF Reports** — Download filtered vitals history as a branded PDF
- **Out-of-Range Alerts** — Automatic warning badges when vitals fall outside normal maternal ranges
- **Appointment Scheduling** — Book meetings with agenda, notes, date & time
- **Prescriptions** — Doctors can issue prescriptions; mothers can view them alongside their vitals

---

## Tech Stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| Frontend | React 18, Tailwind CSS, Recharts, jsPDF |
| Backend  | Node.js, Express.js               |
| Database | MongoDB (Mongoose ODM)            |

---

## Prerequisites

- **Node.js** v16+ — [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB** — Either a local instance or a MongoDB Atlas cluster URI

---

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd mitra-main
```

### 2. Set up environment variables

Create a `.env` file inside the `server/` directory:

```
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/mitra?retryWrites=true&w=majority
```

> Replace the URI with your own MongoDB connection string.

### 3. Install dependencies

Open **two terminals** (one for server, one for client):

**Terminal 1 — Backend:**
```bash
cd server
npm install
```

**Terminal 2 — Frontend:**
```bash
cd client
npm install
```

### 4. Seed the database (optional but recommended)

This populates the database with demo obstetricians, mothers, vitals, appointments, and prescriptions so you can test immediately:

```bash
cd server
node seed.js
```

### 5. Start the application

**Terminal 1 — Start Backend (port 5000):**
```bash
cd server
npm start
```

**Terminal 2 — Start Frontend (port 3000):**
```bash
cd client
npm start
```

### 6. Open in browser

Navigate to [http://localhost:3000](http://localhost:3000)

---

## Demo Credentials

After running `node seed.js`, you can log in with:

| Role          | Email                      | Password      |
|---------------|----------------------------|---------------|
| Obstetrician  | priya.sharma@mitra.com     | password123   |
| Obstetrician  | anita.gupta@mitra.com      | password123   |
| Mother (Prenatal)  | meera@example.com     | password123   |
| Mother (Post-Partum) | sunita@example.com  | password123   |
| Mother (Early Stage) | kavita@example.com  | password123   |

---

## Project Structure

```
mitra-main/
├── client/                  # React frontend
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── components/
│       │   ├── Home.jsx
│       │   ├── Login.jsx
│       │   ├── SignUp.jsx
│       │   ├── DashBoardPatient.jsx
│       │   ├── DashBoardDoctor.jsx
│       │   ├── NavbarPatient.jsx
│       │   ├── PatientInfo.jsx
│       │   ├── AddVitals.jsx
│       │   ├── CheckVitals.jsx
│       │   ├── PostPartumCare.jsx
│       │   ├── Prescriptions.jsx
│       │   └── AppointmentScheduling.jsx
│       └── App.js
├── server/                  # Express backend
│   ├── models/
│   │   ├── Doctor.js
│   │   ├── Patient.js
│   │   ├── Vitals.js
│   │   ├── Appointment.js
│   │   └── Prescription.js
│   ├── Routes/
│   │   └── auth.js
│   ├── index.js             # Server entry point
│   ├── seed.js              # Database seeder
│   ├── package.json
│   └── .env                 # Your MongoDB URI (not committed)
├── .gitignore
└── README.md
```

---

## API Endpoints

| Method | Endpoint                              | Description                        |
|--------|---------------------------------------|------------------------------------|
| POST   | `/api/auth/signup`                    | Register a new mother or doctor    |
| POST   | `/api/auth/login`                     | Login                              |
| GET    | `/api/doctors`                        | List all doctors                   |
| GET    | `/api/patients`                       | List all patients                  |
| GET    | `/api/patient/:email`                 | Get single patient by email        |
| PATCH  | `/api/patient/:id`                    | Update patient fields              |
| POST   | `/api/patient/:id/child`              | Add child to patient               |
| PATCH  | `/api/patient/:id/child/:childIndex`  | Update child details/diet plan     |
| GET    | `/api/vitals/:patientId`              | Get all vitals for a patient       |
| POST   | `/api/vitals`                         | Record new vitals                  |
| GET    | `/api/appointments/:userId`           | Get appointments for user          |
| POST   | `/api/appointments`                   | Schedule an appointment            |
| GET    | `/api/prescriptions/:patientId`       | Get prescriptions for a patient    |
| POST   | `/api/prescriptions`                  | Add a prescription                 |
