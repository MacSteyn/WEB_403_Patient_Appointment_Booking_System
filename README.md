# 🏥 MediBook — Patient Appointment Booking System

A full-stack SPA for booking and managing medical appointments, built with React, Express, MongoDB, and SASS.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router v6, SASS, Bootstrap 5 |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Sessions | express-session + cookie-parser |
| PWA | Vite PWA Plugin (service worker + manifest) |
| SSL | Let's Encrypt (via Render/Railway on live server) |

---

## 📁 Project Structure

```
patient-booking-system/
├── client/           # React frontend (Vite)
│   ├── src/
│   │   ├── components/   # Navbar, ProtectedRoute, AppointmentCard
│   │   ├── context/      # AuthContext (global auth state)
│   │   ├── pages/        # Home, Login, Register, Dashboard, BookAppointment, Profile, AdminPanel
│   │   ├── styles/       # SASS variables, mixins, main stylesheet
│   │   └── utils/        # Axios API instance with interceptors
│   └── vite.config.js    # Vite + PWA config
│
└── server/           # Express backend
    ├── config/       # MongoDB connection
    ├── models/       # User, Doctor, Appointment schemas
    ├── routes/       # auth, appointments, doctors
    ├── middleware/   # JWT auth, role-based access
    └── server.js     # Main entry point
```

---

## ⚙️ Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/patient-booking-system.git
cd patient-booking-system
```

### 2. Setup the Backend
```bash
cd server
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, etc.

npm run dev   # Starts on http://localhost:5000
```

### 3. Setup the Frontend
```bash
cd client
npm install
npm run dev   # Starts on http://localhost:5173
```

---

## 🔐 Environment Variables

Create `server/.env` from `server/.env.example`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/patient_booking
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=7d
SESSION_SECRET=your_session_secret
CLIENT_URL=http://localhost:5173
```

---

## 👥 User Roles

| Role | Access |
|---|---|
| **Patient** | Register, login, book/cancel appointments, view history, edit profile |
| **Doctor** | Login, view their scheduled appointments |
| **Admin** | Full access — manage doctors, patients, confirm/delete appointments |

### Creating an Admin User
Register normally, then update the role in MongoDB:
```js
db.users.updateOne({ email: "admin@example.com" }, { $set: { role: "admin" } })
```

---

## 📱 PWA Features
- Installable on mobile and desktop
- Offline support via service worker caching
- Web app manifest with icons and theme colors
- Works on iOS and Android

---

## 🌐 Deployment (Live Server)

### Backend → Render
1. Push to GitHub
2. Create a new **Web Service** on [render.com](https://render.com)
3. Set root directory to `server/`
4. Build command: `npm install`
5. Start command: `node server.js`
6. Add all environment variables in Render dashboard
7. SSL is automatically provided by Render ✅

### Frontend → Vercel or Netlify
1. Create new project on [vercel.com](https://vercel.com)
2. Set root directory to `client/`
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add env var: `VITE_API_URL=https://your-render-url.onrender.com`
6. SSL is automatically provided ✅

---

## 📋 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/logout` | Logout user |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/profile` | Update profile |

### Appointments
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/appointments` | Get all (role-based) |
| POST | `/api/appointments` | Book appointment |
| PUT | `/api/appointments/:id` | Update status |
| DELETE | `/api/appointments/:id` | Delete (admin only) |

### Doctors
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/doctors` | List all doctors |
| GET | `/api/doctors/:id` | Get single doctor |
| POST | `/api/doctors` | Create doctor (admin) |
| PUT | `/api/doctors/:id` | Update doctor |

---

## 🔒 Security Features
- Passwords hashed with bcryptjs (salt rounds: 10)
- JWT tokens stored in httpOnly cookies
- Session management with express-session
- CORS configured with credential support
- Role-based route protection on both frontend and backend
- SSL/HTTPS on production server

---

## 📸 Pages Overview

- **Home** — Landing page with hero, specialty browser, features
- **Register** — Full form with client-side validation
- **Login** — Secure login with JWT + session
- **Dashboard** — Appointment stats + filtered list
- **Book Appointment** — Doctor selection, date/time, reason form
- **Doctors** — Browse and filter by specialty
- **Profile** — View and edit user information
- **Admin Panel** — Manage appointments, doctors, add new doctors

---

## 📦 GitHub Setup
```bash
git init
git add .
git commit -m "Initial commit: MediBook patient booking system"
git remote add origin https://github.com/YOUR_USERNAME/patient-booking-system.git
git push -u origin main
```
