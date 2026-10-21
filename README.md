# mini-data-dog
# Mini DataDog
https://mini-data-dog.onrender.com/
A lightweight, self-hosted uptime monitoring tool built on the MERN stack. Track the health of your websites and APIs with scheduled checks, real-time analytics, and email alerts when something goes down.

## Features

- **Automated uptime checks** — cron-based background worker pings your monitors on a configurable interval
- **Email alerts** — instant notifications via Brevo when a monitor's status changes (up → down, down → up)
- **Analytics dashboard** — response time trends, uptime percentage, and status history visualized with Recharts
- **Multi-user support** — JWT-authenticated accounts with fully scoped data per user
- **Per-monitor settings** — configure check intervals, alert preferences, and thresholds independently for each monitor
- **Redux-powered state management** — fast, predictable client-side state across the dashboard

## Tech Stack

**Frontend**
- React
- Redux (state management)
- Recharts (analytics visualizations)
- Axios

**Backend**
- Node.js / Express
- MongoDB / Mongoose
- node-cron (scheduled monitor checks)
- JWT (authentication)
- Brevo (transactional email / alerts)

## How It Works

1. Users register/log in and create monitors by supplying a URL and check interval.
2. A cron worker runs in the background, pinging each active monitor on schedule.
3. Each check records response time, HTTP status, and up/down state to MongoDB.
4. Status transitions (e.g. a monitor going from "up" to "down") trigger an email alert via Brevo.
5. The dashboard visualizes historical uptime and response time data per monitor, with a settings page for tuning check behavior per monitor.

## Getting Started

### Prerequisites
- Node.js (v22)
- MongoDB instance (local or Atlas)
- Brevo API key (for email alerts)

### Installation

```bash
git clone https://github.com/<your-username>/mini-datadog.git
cd mini-datadog

# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install

cd ..
```

### Environment Variables

For local development, create a `.env` file in the repository root:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
BREVO_API_KEY=your_brevo_api_key
EMAIL_FROM_ADDRESS=your_verified_sender_email
CLIENT_URL=http://localhost:5173
VITE_FIREBASE_API_KEY=your_firebase_web_api_key
```

### Running Locally

```bash
# Start the backend (API + cron worker)
npm run dev

# Start the frontend
cd client
npm run dev
```

The app will be available at `http://localhost:5173` (or your configured Vite port), with the API running on `http://localhost:3000`.

## Deploying to Netlify

The repository includes a Netlify configuration for deploying the Vite frontend and Express API together. Connect the repository to Netlify and use the detected `netlify.toml` settings, or run `npm run build:netlify` to build locally. Netlify publishes `client/dist`, forwards `/api/*` to the Express function, and runs monitor checks using a scheduled function once per minute.

Set these environment variables in **Site configuration → Environment variables** before deploying:

| Variable | Purpose |
| --- | --- |
| `MONGO_URI` | MongoDB connection string reachable by Netlify Functions |
| `JWT_SECRET` | Secret used to sign authentication tokens |
| `CLIENT_URL` | Deployed site origin, for example `https://your-site.netlify.app` |
| `BREVO_API_KEY` | Brevo API key for email notifications |
| `EMAIL_FROM_ADDRESS` | Verified sender address used by email notifications |
| `VITE_FIREBASE_API_KEY` | Firebase web API key, available to the frontend at build time |

`EMAIL_FROM` is optional and controls the sender display name. Set environment variables for the deploy contexts where the site will run, then trigger a new deploy so the frontend build can read `VITE_FIREBASE_API_KEY`. Keep private values out of frontend-prefixed (`VITE_`) variables.

The scheduled function needs a Netlify plan that supports Scheduled Functions. Checks run once per minute as in local development; size the monitor workload so each invocation finishes within Netlify's function execution limit.

## Project Structure

```
mini-datadog/
├── client/          # React frontend (dashboard, analytics, settings)
│   └── src/
│       ├── components/
│       ├── redux/
│       └── pages/
├── server/          # Express backend
│   ├── models/
│   ├── routes/
│   ├── services/    # monitorService.js — core check + stats logic
│   ├── cron/         # scheduled monitor worker
│   └── middleware/   # JWT auth
└── README.md
```

## Roadmap

- [ ] SMS/Slack alert integrations
- [ ] Public status page per monitor
- [ ] Incident history and postmortem notes
- [ ] Multi-region check locations
