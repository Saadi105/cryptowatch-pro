# CryptoWatch Pro 🪙

A full-stack real-time cryptocurrency market tracker built with React, Node.js, Express, and MongoDB.

Built by **Saad** as a portfolio/CV project.

---

## What this app does

- Shows live prices for the top 20 coins by market cap
- Highlights the biggest gainers and losers every 60 seconds
- Shows hot coins (BTC, ETH, SOL, BNB, ADA, XRP) with sparkline charts
- Market mood bar (Greedy / Neutral / Fearful / Panic)
- Personal watchlist (saved to MongoDB)
- Price alerts with toast notifications
- Sortable table with search and tab filters
- Animated price flash when data refreshes

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Chart.js |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| API | CoinGecko (free public API) |
| Deployment | Vercel (frontend), Render (backend) |

---

## Folder Structure

```
cryptowatch/
├── package.json              ← root scripts
│
├── server/                   ← Node.js + Express backend
│   ├── index.js              ← server entry point
│   ├── package.json
│   ├── .env.example          ← copy this to .env
│   ├── routes/
│   │   ├── coins.js          ← proxy to CoinGecko API
│   │   ├── watchlist.js      ← watchlist CRUD
│   │   └── alerts.js         ← price alerts CRUD
│   └── models/
│       ├── Watchlist.js      ← MongoDB schema
│       └── Alert.js          ← MongoDB schema
│
└── client/                   ← React frontend
    ├── package.json
    ├── public/
    │   └── index.html
    └── src/
        ├── index.js          ← React entry point
        ├── index.css         ← global styles
        ├── App.jsx           ← root component + state
        ├── hooks/
        │   └── useCryptoData.js  ← data fetching hook
        ├── utils/
        │   └── formatters.js     ← helper functions
        └── components/
            ├── StatCards.jsx     ← 4 summary stat cards
            ├── HotCoins.jsx      ← featured coin cards
            ├── CoinTable.jsx     ← main sortable table
            └── AlertModal.jsx    ← price alert popup
```

---

## How to Run — Step by Step

### Step 1 — Install Node.js

If you don't have Node.js installed:
1. Go to https://nodejs.org
2. Download the **LTS version** (the green button)
3. Install it — keep clicking Next
4. To verify, open a terminal and type: `node --version`
   You should see something like `v20.x.x`

---

### Step 2 — Get your MongoDB connection string

The app saves your watchlist and alerts to a free MongoDB database.

1. Go to https://mongodb.com/atlas
2. Click "Try Free" and create an account
3. Create a **free cluster** (M0 tier — free forever)
4. Click "Connect" → "Connect your application"
5. Copy the connection string — it looks like:
   `mongodb+srv://yourName:yourPassword@cluster0.xxxxx.mongodb.net/`
6. Replace `<password>` with your actual password

---

### Step 3 — Set up the server environment

1. Inside the `server` folder, find the file `.env.example`
2. **Copy** that file and rename the copy to `.env`
   (The `.env` file holds your secrets — never push it to GitHub)
3. Open `.env` and paste your MongoDB connection string:

```
MONGODB_URI=mongodb+srv://yourName:yourPassword@cluster0.xxxxx.mongodb.net/cryptowatch
PORT=5000
```

---

### Step 4 — Install all dependencies

Open a terminal in VS Code (`Ctrl + \`` on Windows, `Cmd + \`` on Mac).

Make sure you're in the `cryptowatch` folder, then run:

```bash
# Install server dependencies
cd server
npm install

# Go back to root, then install client dependencies
cd ../client
npm install
```

This installs all the packages listed in each `package.json`.
It takes about 1–2 minutes.

---

### Step 5 — Run the backend server

Open a terminal and run:

```bash
cd server
npm run dev
```

You should see:
```
✅ Connected to MongoDB
🚀 Server running on http://localhost:5000
```

Test it: open your browser and go to http://localhost:5000
You should see: `{"message":"CryptoWatch API is running!","status":"ok"}`

---

### Step 6 — Run the frontend (in a NEW terminal)

Open a **second terminal** (keep the server running in the first one).

```bash
cd client
npm start
```

This opens your browser automatically at http://localhost:3000
The app should load with live crypto data!

---

### Step 7 — Use the app

- The table shows live top 20 coins, auto-refreshing every 60 seconds
- Click the ⭐ star on any coin to add it to your watchlist
- Click the 🔔 bell icon to set a price alert
- Use the tabs to filter: All / Pumping / Dipping / Watchlist
- Click any column header to sort
- Type in the search box to find a coin

---

## Common Errors & Fixes

| Error | Fix |
|-------|-----|
| `Cannot connect to MongoDB` | Check your MONGODB_URI in .env — no spaces, correct password |
| `Port 5000 already in use` | Change PORT=5001 in .env |
| `npm not found` | Node.js isn't installed — do Step 1 again |
| CoinGecko rate limit (429) | Wait 30 seconds — free tier allows 10-30 calls/min |
| Blank page on localhost:3000 | Check the client terminal for error messages |

---

## Deployment (put it online for your CV)

### Deploy Frontend to Vercel (free)
1. Push your code to GitHub
2. Go to https://vercel.com and sign in with GitHub
3. Import your repository
4. Set the root directory to `client`
5. Click Deploy — done in 2 minutes!

### Deploy Backend to Render (free)
1. Go to https://render.com
2. Create a "Web Service" from your GitHub repo
3. Set root directory to `server`
4. Add your environment variables (MONGODB_URI, PORT)
5. Deploy!

After deploying, update the `proxy` in `client/package.json` to your Render URL.

---

## Skills this project demonstrates (for your CV)

- REST API design with Express.js
- React hooks (useState, useEffect, useCallback, custom hooks)
- MongoDB with Mongoose (schemas, CRUD operations)
- External API integration (CoinGecko)
- Caching with node-cache
- Component-based architecture
- Real-time data polling
- Responsive UI design
- Error handling and loading states

---

## CV Description

> Built a full-stack real-time cryptocurrency dashboard using React 18, Node.js/Express, and MongoDB Atlas. Integrated CoinGecko API with server-side caching to track live prices and 24h changes for the top 20 coins. Features include a personal watchlist, price alerts with push notifications, sortable table, market mood index, and animated price feed. Deployed frontend to Vercel and backend to Render.
