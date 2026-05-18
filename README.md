# 📞 AI Calling Agent SaaS Platform

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://nodejs.org/)
[![Framework](https://img.shields.io/badge/framework-Express.js-blue)](https://expressjs.com/)
[![Database](https://img.shields.io/badge/database-MongoDB-green)](https://www.mongodb.com/)
[![AI Engine](https://img.shields.io/badge/AI-Groq%20Cloud-orange)](https://groq.com/)
[![License](https://img.shields.io/badge/license-ISC-red)](LICENSE)

An advanced, production-ready SaaS platform that empowers businesses with AI-driven communication tools and a robust product management ecosystem.

---

## 🚀 Project Overview

The **AI Calling Agent SaaS Platform** is a comprehensive solution designed to automate business-to-customer interactions. It combines a professional E-commerce product catalog with a cutting-edge **AI Script Generator** powered by the Groq LPU™ Inference Engine. Whether you're setting appointments, cold calling, or providing customer support, our platform generates high-converting, context-aware scripts tailored to your specific business needs.

---

## ✨ Key Features

### 🤖 AI Call Script Generation
*   **Context-Aware AI:** Leveraging Groq's high-speed inference for near-instant script generation.
*   **Customizable Parameters:** Generate scripts based on Business Name, Target Audience, Tone (Professional, Casual, Aggressive), and Language.
*   **Free Trial System:** Integrated logic providing users with 3 complimentary generations before requiring a subscription upgrade.
*   **Script History:** Persistent storage of all generated scripts for easy retrieval and management.

### 🛍️ E-Commerce & Favorites
*   **Dynamic Product Catalog:** Sleek UI with advanced server-side pagination, real-time search, and category filtering.
*   **Favorites System:** One-click wishlist functionality allowing users to save and manage their favorite products.
*   **Interactive Modals:** Detailed product views via responsive AJAX-powered modals.

### 🔐 Security & User Management
*   **Role-Based Access Control (RBAC):** Distinct permissions for `Admin` and `Customer` roles.
*   **Authentication:** Robust session-based authentication for web users and JWT (JSON Web Tokens) for API security.
*   **Profile Management:** Fully customizable user profiles with Multer-powered avatar uploads.

### 🛠️ Admin Infrastructure
*   **Comprehensive Dashboard:** A dedicated space for admins to manage the entire product lifecycle (CRUD).
*   **Media Management:** Secure image uploads for products and user avatars with automatic file naming and storage.
*   **User Oversight:** Admin-only views for monitoring system-wide script generation history.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose ODM) |
| **AI Integration** | Groq SDK (Mixtral-8x7b-32768) |
| **View Engine** | EJS (Embedded JavaScript) |
| **Authentication** | JWT, Express-Session, Bcrypt.js |
| **Storage** | Multer (Local File System) |
| **Styling** | Custom CSS (Responsive Design) |

---

## 📁 Folder Structure

The project follows a clean, modular **MVC (Model-View-Controller)** architecture to ensure scalability and maintainability.

```text
AI_calling_agent_complete/
├── config/             # Database & environment configurations
├── controllers/        # Business logic for each module
├── middleware/         # Auth, RBAC, and API validation
├── models/             # Mongoose schemas (User, Product, Script)
├── public/             # Static assets (CSS, JS, Images, Uploads)
├── routes/             # Express route definitions (Web & API)
├── services/           # External service integrations (Groq AI)
└── views/              # EJS templates & partials
server.js               # Application entry point
seeder.js               # Database seeding utility
```

---

## ⚙️ Installation Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/m-rafay-bukhari/AI-Calling-Agent.git
cd AI-Calling-Agent
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory and populate it with the following:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/ai_calling_agent
SESSION_SECRET=your_complex_session_secret
JWT_SECRET=your_secure_jwt_secret
GROQ_API_KEY=your_groq_api_key_here
```

### 4. Seed the Database
Populate the application with initial product data:
```bash
node seeder.js
```

### 5. Start the Server
```bash
# Production Mode
npm start

# Development Mode (with Nodemon)
npm run dev
```

---

## 📡 API Endpoints (v1)

### Authentication
*   `POST /api/v1/auth/login` - User login (Returns JWT)
*   `POST /api/v1/auth/signup` - User registration

### Products
*   `GET /api/v1/products` - List all products (Paginated)
*   `GET /api/v1/products/:id` - Get single product details

### User Profile
*   `GET /api/v1/user/profile` - Fetch current user profile (Requires JWT)

---

## 📸 Screenshots

> *Note: Place your screenshots in a `screenshots/` folder to display them here.*

| | |
| :--- | :--- |
| **Homepage** | ![Homepage Placeholder](https://via.placeholder.com/400x250?text=Homepage+UI) |
| **AI Generator** | ![Generator Placeholder](https://via.placeholder.com/400x250?text=AI+Script+Generator) |
| **Admin Dashboard** | ![Admin Placeholder](https://via.placeholder.com/400x250?text=Admin+Dashboard) |
| **Favorites Page** | ![Favorites Placeholder](https://via.placeholder.com/400x250?text=Favorites+Wishlist) |

---

## 🔮 Future Improvements

- [ ] **Payment Integration:** Stripe/PayPal for real-time subscription billing.
- [ ] **Voice Synthesis:** Integration with ElevenLabs or Google TTS for "vocalizing" generated scripts.
- [ ] **CRM Sync:** Direct export of scripts and leads to Salesforce or Hubspot.
- [ ] **Analytics:** Advanced charting for user generation trends and product popularity.
- [ ] **Multi-lingual Support:** Expanding AI generation to over 50+ languages.

---

## 👤 Author

**Rafay Bukhari**
*   GitHub: [@m-rafay-bukhari](https://github.com/m-rafay-bukhari)
*   LinkedIn: [Rafay Bukhari](https://linkedin.com/in/rafay-bukhari)

---
*Developed with ❤️ as a 5th-semester project.*
