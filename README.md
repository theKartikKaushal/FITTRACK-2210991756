# FIT-TRACK

📖 About
FitTrack is a full-stack web application built as a Final Year Project at Chitkara University, Rajpura, Punjab. It helps users manage their daily fitness routines, track health habits, and never miss a medicine dose — all in one place.
The system integrates personalized fitness planning with a medicine reminder module, creating a unified platform that supports both physical wellness and health adherence.



✨ Features
🏃 Workout Tracking

Personalized exercise plans generated from a fitness quiz (Beginner / Intermediate / Advanced)
Mark exercises as complete with a confirmation modal
Points earned per exercise, weekly point total tracked
Cannot mark an exercise done twice on the same day

📊 Data Visualisation

Pie chart — today's completed vs remaining exercises
Bar chart — weekly overview of daily completions
Activity heatmap — GitHub-style grid showing last 90 days of activity, color-coded by completion percentage
Progress stats — current streak, average completion %, best day, monthly comparison

💊 Medicine Tracker

Add medicines with name, purpose, and reminder time
Auto-sorted into Morning (6AM–12PM), Afternoon (12PM–4PM), Night (4PM+)
Mark doses as taken (one-way, cannot be undone)
Streak tracking for daily consistency
Browser push notifications at the set reminder time
Per-user data — medicines from one user never appear for another

🏆 Achievements & Leaderboard

Badge milestones: Century (100pts), Fitness Enthusiast (500pts), Workout Warrior (1000pts)
Community leaderboard ranked by weekly points
Toggle your own visibility on the leaderboard


🔐 User Authentication

Secure signup and login
Per-user data isolation enforced at both API and database level
Session managed via localStorage


🛠 Tech Stack
LayerTechnologyFrontendReact.js (Vite), Framer Motion, Recharts, Lucide React, Tailwind CSSBackendNode.js, Express.jsDatabaseMongoDB, Mongoose ODMChartsRecharts (Bar, Pie, Line)AnimationsFramer MotionRoutingReact Router DOM

📁 Project Structure
fittrack/
├── src/
│   ├── components/
│   │   ├── Home.jsx          # Landing page
│   │   ├── Feature.jsx       # Workout tracking, heatmap, leaderboard
│   │   ├── Health.jsx        # Medicine tracker
│   │   ├── Fitnessquiz.jsx   # Initial fitness quiz
│   │   ├── Navbar.jsx        # Navigation
│   │   ├── Login.jsx         # Login page
│   │   └── Signup.jsx        # Signup page
│   └── assets/
│       └── images/           # All image assets
│
└── server/
    ├── index.js              # Express server & API routes
    └── models.js             # Mongoose schemas






    👨‍💻 Author
Kartik Kaushal
Roll No: 2210991756
Chitkara University, Rajpura, Punjab
📧 kartik1756.be22@chitkara.edu.in
📞 7876604344
Supervisor: Preeti Saini


📄 License
This project was developed as a Final Year Project and is registered under copyright.
© 2025 Kartik Kaushal — Chitkara University. All rights reserved.
