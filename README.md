## Carevia (MERN)

Full-stack health & wellness app scaffolded with React + Vite + Tailwind, Node + Express, MongoDB + Mongoose, JWT auth, and placeholder AI modules.

### Tech
- Frontend: React + Vite + TailwindCSS
- Backend: Node.js + Express
- Database: MongoDB (Mongoose)
- Auth: JWT + bcrypt
- Charts: Recharts

### Theming
- Primary (Blue): `#2980B9`
- Secondary (Green): `#2ECC71`
- Accent (Purple): `#9B59B6`
- Neutral Light: `#F4F6F7`
- Neutral Dark: `#BDC3C7`

### Getting Started
1. Copy `.env.example` to `.env` and set values
2. Start backend:
   - `cd backend`
   - `npm i`
   - `npm run dev`
3. Start frontend:
   - `cd frontend`
   - `npm i`
   - `npm run dev`

Backend will run on `http://localhost:5000`, frontend on `http://localhost:5173`.

### Scripts
- Backend: `npm run dev` (nodemon), `npm start`
- Frontend: `npm run dev`, `npm run build`, `npm run preview`

### API Overview
- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- `PUT /api/users/me`, `DELETE /api/users/me`
- `GET/POST/PUT/DELETE /api/health`
- `GET/POST/DELETE /api/mood`
- `GET/POST/PUT/DELETE /api/articles`
- `POST /api/ai/symptom-check`, `/api/ai/nutrition-plan`, `/api/ai/chat` (placeholders)
- `GET /api/privacy/export`, `DELETE /api/privacy/delete`

### Notes
- Adjust `VITE_API_URL` in frontend env if backend URL differs.
- AI endpoints are placeholders; integrate your preferred provider.

