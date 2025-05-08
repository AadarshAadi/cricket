🏏 CRICKET PLAYER MANAGEMENT WEB APP
===================================

A full-stack web application to manage cricket players, teams, and match statistics.
Built with React (frontend) and Flask (backend), using MongoDB for data storage.

------------------------------------
TECHNOLOGIES USED
------------------------------------

Frontend:
- React
- Tailwind CSS
- Axios
- React Router
- Framer Motion (for animations)

Backend:
- Flask
- Flask-CORS
- PyMongo (MongoDB integration)

Database:
- MongoDB (local instance or MongoDB Atlas)

------------------------------------
SETUP INSTRUCTIONS
------------------------------------

1. BACKEND SETUP (Flask API):

- Navigate to the backend directory:
    cd server

- (Optional) Create a virtual environment:
    python -m venv venv
    source venv/bin/activate  (Windows: venv\Scripts\activate)

- Install dependencies:
    pip install -r requirements.txt

- Start the server:
    python app.py

- The Flask API runs at: http://localhost:5000

2. FRONTEND SETUP (React App):

- Navigate to the frontend directory:
    cd client

- Install dependencies:
    npm install

- Start the development server:
    npm start

- The frontend runs at: http://localhost:3000

------------------------------------
SCREENSHOT
------------------------------------

Deployment: https://your-deployment-link.com

Screenshot: 

[Landing Page](./Screenshots/front.png)

[Dashboard](./Screenshots/dash.png) 

[Teams Page](./Screenshots/teams.png)

[Match Page](./Screenshots/matches.png) 

[Players Page](./Screenshots/players.png)

[History Page](./Screenshots/history.png) 


------------------------------------
ASSUMPTIONS MADE DURING DEVELOPMENT
------------------------------------

- Each player belongs to only one team.
- A team can exist without players or match data.
- Matches include basic win/loss info and are recorded per team.
- Top player is calculated by runs (as default).
- No authentication or login system is implemented.
- All data is stored locally in MongoDB.
- Frontend and backend must run simultaneously for full functionality.

------------------------------------
FEATURES
------------------------------------

- Add/Edit/Delete Teams and Players
- Assign players to teams
- Record team match history
- View player stats: runs, wickets, matches played
- Team match statistics including win/loss ratio and top performer
- Search and paginate players/teams
- Responsive design with clean UI
