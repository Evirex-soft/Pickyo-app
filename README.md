🚚 Pickyo – On-Demand Logistics Platform

Pickyo is an on-demand logistics marketplace that connects customers and businesses with drivers and fleet owners for cargo delivery services like bikes, pickups, mini trucks, and trucks.

The platform works similar to "Uber for cargo", allowing users to book deliveries and drivers to accept and complete them while earning per trip.

📁 Project Structure
project-root/
│
├── backend/ → Node.js backend API
├── frontend/ → React/Next.js frontend application
└── README.md

Both applications run independently.

⚙️ Tech Stack
Frontend

React / Next.js

Maps Integration

Razorpay (Payments)

Backend

Node.js

Express / NestJS

PostgreSQL

Redis (Realtime tracking)

WebSockets

🚀 Getting Started
1️⃣ Clone the Repository
git clone <your-repo-url>
cd project-name
▶️ Running the Backend
cd backend
npm install
npm run dev

Backend will start in development mode.

▶️ Running the Frontend
cd frontend
npm install
npm run dev

Frontend will start in development mode.

🔑 Environment Variables

Both frontend and backend require .env files.

Create a .env file inside each folder:

Example (Backend .env)
PORT=5000
DATABASE_URL=your_database_url
JWT_SECRET=your_secret
RAZORPAY_KEY=your_key
Example (Frontend .env)
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_MAPS_KEY=your_maps_key
🔄 High-Level Flow

Customer creates booking

Backend processes booking

Driver matching algorithm assigns nearest driver

Real-time tracking via WebSockets

Delivery completed

Commission calculated automatically

📌 Core Features
Customer Side

OTP / Google Login

Booking with map selection

Vehicle selection (Bike / Pickup / Mini Truck / Truck)

Live tracking

Razorpay payments

Order history & invoice download

Driver Side

Document onboarding

Go Online / Offline

Accept / Reject orders

Earnings dashboard

Commission auto-calculation

Admin Panel

Driver approval

Order management

Commission control

Reports & analytics

📈 Future Enhancements

Surge pricing

B2B subscriptions

AI-based routing

Driver benefits (insurance, loans)

👨‍💻 Development Notes

Backend and frontend are completely decoupled.

Realtime updates use WebSockets.

Commission is calculated automatically based on vehicle type.

Designed MVP-first and scalable architecture.
