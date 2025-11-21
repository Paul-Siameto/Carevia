# Carevia - Digital Health & Wellness Companion

A modern, full-stack health and wellness application built with the MERN stack. Carevia helps users track their health metrics, mood, medications, and provides AI-powered wellness guidance in a beautiful, intuitive interface.

![Carevia](https://img.shields.io/badge/Status-Active-success)
![React](https://img.shields.io/badge/React-18+-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen)

## ✨ Features

### Core Features
- **Health Tracking**: Log and monitor vital signs, weight, symptoms, and medications
- **Mood Tracking**: Track daily mood patterns with visual analytics (Premium)
- **AI Wellness Assistant**: Get personalized health tips and wellness guidance powered by Google Gemini AI
- **Health Articles**: Access curated health and wellness articles (Premium)
- **User Dashboard**: Beautiful, animated dashboard with health insights and trends
- **Privacy Controls**: Export or delete your data at any time

### Premium Features
- Full mood tracking with trend analysis
- Access to curated health articles
- AI assistant for wellness questions
- Advanced analytics and insights

### Payment Integration
- **Paystack**: Credit/debit card payments (NGN/KES)
- **M-Pesa**: Mobile money payments via STK Push (Kenya)

### UI/UX Highlights
- 🎨 Modern, gradient-based design with glassmorphism effects
- ✨ Smooth animations and transitions throughout
- 🌓 Dark mode support
- 📱 Fully responsive design
- 🎯 Intuitive navigation and user experience
- 💫 Micro-interactions and hover effects

## 🛠️ Tech Stack

### Frontend
- **React 18+** - UI library
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **Recharts** - Chart library for data visualization
- **React Router** - Client-side routing
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Google Generative AI** - AI wellness assistant

### Payment Gateways
- **Paystack** - Payment processing
- **M-Pesa (Safaricom Daraja API)** - Mobile money payments

## 🎨 Design System

### Color Palette
- **Primary**: Blue gradient (`#0ea5e9` - `#0284c7`)
- **Secondary**: Green gradient (`#22c55e` - `#16a34a`)
- **Accent**: Purple gradient (`#a855f7` - `#9333ea`)
- **Neutral Light**: `#F8FAFC`
- **Neutral Dark**: `#CBD5E1`

### Animations
- Fade-in, fade-in-up, fade-in-down
- Slide-in transitions
- Scale animations
- Smooth hover effects
- Page load animations

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Carevia
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

### Environment Variables

#### Backend (`.env`)
```env
# Database
MONGODB_URI=mongodb://localhost:27017/carevia
# For MongoDB Atlas, use: mongodb+srv://your-username:your-password@your-cluster.mongodb.net/carevia

# JWT
JWT_SECRET=your-super-secret-jwt-key-here

# Server
PORT=5000
NODE_ENV=development

# CORS
CLIENT_URL=http://localhost:5173
CLIENT_ORIGINS=http://localhost:5173,http://localhost:5174

# AI (Google Gemini)
GEMINI_API_KEY=your-google-gemini-api-key

# Paystack
PAYSTACK_SECRET_KEY=your-paystack-secret-key

# M-Pesa (Safaricom Daraja API)
MPESA_CONSUMER_KEY=your-mpesa-consumer-key
MPESA_CONSUMER_SECRET=your-mpesa-consumer-secret
MPESA_SHORTCODE=your-shortcode
MPESA_PASSKEY=your-passkey
MPESA_CALLBACK_URL=https://yourdomain.com/api/billing/mpesa/callback
MPESA_AUTH_URL=https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials
MPESA_STK_PUSH_URL=https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest
```

#### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:5000
VITE_PAYSTACK_PUBLIC_KEY=your-paystack-public-key
```

### Running the Application

1. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

2. **Start Backend**
   ```bash
   cd backend
   npm run dev
   ```
   Backend runs on `http://localhost:5000`

3. **Start Frontend**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

## 📁 Project Structure

```
Carevia/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── aiController.js    # AI wellness assistant
│   │   ├── authController.js  # Authentication
│   │   ├── billingController.js # Payment processing
│   │   ├── healthController.js  # Health entries
│   │   ├── moodController.js    # Mood tracking
│   │   └── ...
│   ├── middleware/
│   │   └── auth.js            # JWT authentication
│   ├── models/
│   │   ├── User.js
│   │   ├── HealthEntry.js
│   │   ├── MoodEntry.js
│   │   └── Article.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── billing.js         # Payment routes
│   │   ├── health.js
│   │   └── ...
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── auth/
│   │   │   ├── AuthContext.js
│   │   │   ├── ProtectedRoute.js
│   │   │   └── PremiumRoute.js
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ChatBox.jsx
│   │   │   └── ...
│   │   ├── pages/
│   │   │   ├── Dashboard.js
│   │   │   ├── Landing.js
│   │   │   ├── Pricing.jsx
│   │   │   └── ...
│   │   ├── styles.css
│   │   └── App.js
│   └── tailwind.config.js
│
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Health Tracking
- `GET /api/health` - Get all health entries
- `POST /api/health` - Create health entry
- `PUT /api/health/:id` - Update health entry
- `DELETE /api/health/:id` - Delete health entry

### Mood Tracking (Premium)
- `GET /api/mood` - Get all mood entries
- `POST /api/mood` - Create mood entry
- `DELETE /api/mood/:id` - Delete mood entry

### Articles (Premium)
- `GET /api/articles` - Get all articles
- `POST /api/articles` - Create article (Admin)
- `PUT /api/articles/:id` - Update article (Admin)
- `DELETE /api/articles/:id` - Delete article (Admin)

### AI Assistant
- `POST /api/ai/chat` - Chat with AI wellness assistant
- `POST /api/ai/symptom-check` - Symptom analysis
- `POST /api/ai/nutrition-plan` - Nutrition planning

### Billing & Payments
- `POST /api/billing/paystack/confirm` - Verify Paystack payment
- `POST /api/billing/mpesa/initiate` - Initiate M-Pesa STK push
- `POST /api/billing/mpesa/callback` - M-Pesa payment callback
- `POST /api/billing/mpesa/verify` - Verify M-Pesa payment

### Privacy
- `GET /api/privacy/export` - Export user data
- `DELETE /api/privacy/delete` - Delete user account

## 💳 Payment Setup

### Paystack
1. Sign up at [Paystack](https://paystack.com)
2. Get your public and secret keys from the dashboard
3. Add keys to environment variables
4. For production, use live keys instead of test keys

### M-Pesa (Safaricom Daraja API)
1. Register at [Safaricom Developer Portal](https://developer.safaricom.co.ke)
2. Create an app to get Consumer Key and Secret
3. Get your Shortcode and Passkey
4. Configure callback URL in your app settings
5. For production, use production endpoints instead of sandbox

## 🎯 Key Features Explained

### Dashboard
- Real-time health statistics
- Weight trend visualization with area charts
- AI-powered daily wellness tips
- Mood trend analysis (Premium)
- Beautiful animated cards with gradient effects

### Health Tracking
- Log vital signs, weight, symptoms
- Medication reminders
- Historical data tracking
- Export capabilities

### AI Wellness Assistant
- Powered by Google Gemini AI
- Personalized health tips
- Symptom checking
- Nutrition planning
- 24/7 availability

## 🎨 UI/UX Features

- **Modern Design**: Gradient backgrounds, glassmorphism effects
- **Smooth Animations**: Fade-in, slide, scale transitions
- **Dark Mode**: Full dark mode support
- **Responsive**: Mobile-first design
- **Accessibility**: Focus states, keyboard navigation
- **Performance**: Optimized rendering and lazy loading

## 🔒 Security

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- CORS configuration
- Input validation
- Secure payment processing

## 📝 Scripts

### Backend
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🚧 Development Notes

- AI endpoints use Google Gemini API - configure your API key
- Payment integrations require proper credentials
- MongoDB connection string should be configured
- CORS origins should match your frontend URL
- For production, update all environment variables

## 📄 License

This project is licensed under the ISC License.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues, questions, or contributions, please open an issue on the repository.

---

**Built with ❤️ for better health and wellness**
