#🤪 Lucky Bites – Core Features & Requirements

**Background:**  
LUCKY BITES is an interactive web platform that lets friends, family, or colleagues decide who pays 💸, who gets exempted 🆓, and who receives the Ebarimt (VAT) receipt 🧾 in a fun and fair way. The platform supports real-time multiplayer 🎮 interactions and AI-assisted 🤖 decision-making to ensure entertaining and unbiased outcomes.

---
## 🔄 Functional Requirements
🔹 **User Connection & Room Management**

🆕 Create a Room: Users can create a new room without registration.

🔑 Room Code: A unique code is automatically generated to share with other participants.

🚪 Join Room: Enter the room using the generated code, no registration required.

👤 Nickname: Users can set their display name or nickname before joining the game.

**🔹 Room Control**

📋 Participants List: Display all users currently in the room.

🎮 Select Game Mode: Choose between Spin the Wheel 🎡, AI Roast 🤖, or Runner Game 🏃.

⏱️ Time Control: Manage start and end times of the game rounds.

👑 Owner / Boss: The creator of the room is automatically designated as the boss.

Only the boss has administrative privileges, including adjusting AI response style or managing rounds.

If the boss leaves, the next person who joins the room becomes the new boss automatically.

No other participants can delete the room or kick users; admin rights are dynamically assigned based on boss presence.

**🔹 Game Modes**
1.🎡 Spin the Wheel

Automatically add all participants’ names to the wheel.

Randomly select one participant to pay.

Include animated spinning effect for visual engagement.

2.🤖 AI Roast (using Google Gemini)

Each participant submits a funny reason: “Why shouldn’t I pay today?”

Google Gemini AI evaluates submissions to select the funniest or least convincing reason.

The chosen participant is exempted from payment and announced with a message like: “You don’t pay today!”

3.🐌 Runner Game

Players compete in real-time to press a button as fast as possible.

The fastest player is exempted from paying, while others remain liable.

Fully synchronized with WebSocket to ensure fair timing across all participants.

**🔹 UI/UX Requirements**

Simple Interface: Easy to use without registration; intuitive layout.

Responsive Design: Works on mobile, tablet, and desktop.

Animations: Display Spin the Wheel, AI results, and Runner outcomes with engaging animations.

Dark/Light Mode: Optional theme toggle for user preference.

**🔹 Additional Features**

Share Link: Send room code via Messenger, WhatsApp, Telegram, etc.

Screenshot Button: Save the winner or game result image.

Multiple Rounds: Allow consecutive games without closing the room.

Sound Effects: Play sounds during wheel spins, AI selection, or Runner winner announcement.

**🔹 Technical Requirements**

Frontend: HTML, CSS, JavaScript (React or Vue recommended)

Backend: Node.js + Express with real-time support

Realtime: Socket.io or WebRTC

AI Integration: Google Gemini API (for AI Roast mode)

Deployment: Vercel / Netlify for frontend, Railway / Render for backend

Database: Firebase Realtime DB or MongoDB for room and user data
