# 🍽️ FoodReels – Short Video Food Discovery Platform

FoodReels is a **full-stack short-video food discovery platform** inspired by modern reels-based applications.  
Users can explore food videos, like & save dishes, and visit food partner profiles, while food partners can upload food videos to promote their business.

---

## 🚀 Features

### 👤 User Features
- User registration & login (JWT + Cookies)
- Browse food videos in a vertical reels feed
- Auto-play videos on scroll (Intersection Observer)
- Like / Unlike food items
- Save / Unsave food items
- View saved food videos
- Visit food partner profiles

### 🏪 Food Partner Features
- Food partner registration & login
- Upload short food videos
- Add food name & description
- Public food partner profile
- View uploaded food videos

### 🎥 Media Handling
- Video upload using **ImageKit**
- CDN-based video streaming
- Video preview before upload

---

## 🛠️ Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB & Mongoose
- JWT Authentication
- bcryptjs (password hashing)
- Multer (file upload handling)
- ImageKit (video storage)
- Cookie-based authentication
- CORS enabled

### Frontend
- React (Vite)
- React Router DOM
- Axios
- Custom CSS (modern UI)
- Mobile-first reels layout
- Intersection Observer API

---

## Project Structure

foodreels/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   ├── services/
│   │   ├── db/
│   │   └── app.js
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│
└── README.md

---

## 🔐 Authentication Flow

- JWT token is generated on login/register
- Token is stored in HTTP-only cookies
- Protected routes use middleware:
  - authUserMiddleware
   authFoodPartnerMiddleware

  ---

## 📡 API Endpoints

### Auth

```http
POST   /api/auth/user/register
POST   /api/auth/user/login
GET    /api/auth/user/logout

POST   /api/auth/foodpartner/register
POST   /api/auth/foodpartner/login
GET    /api/auth/foodpartner/logout


POST   /api/food              (Food Partner only)
GET    /api/food              (User only)
POST   /api/food/like         (User only)
POST   /api/food/save         (User only)
GET    /api/food/save         (User only)


GET    /api/food-partner/:id  (User only)
```
---

## ▶️ How to Run Locally

### Backend
cd backend
npm install
npm run dev

### Frontend
cd frontend
npm install
npm run dev

---

## ✨ Highlights

- Smooth vertical reels experience
- Clean and modern UI
- Secure cookie-based authentication
- Real-time like/save counters
- Modular backend architecture
- Scalable for future features (comments, orders, analytics)

--- 

## 📜 License

- This project is licensed under the MIT License.
