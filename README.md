# MiniLedger

MiniLedger is a small app for keeping track of money you've lent to friends.

You sign in with your phone number and the OTP. Then you record each loan: who you lent to, how much, when you lent it and when it's due. The dashboard shows how much you've lent in total, how much has come back and how much is overdue. Overdue loans are highlighted in red. Tap a loan to see its details and mark it as repaid when your friend pays you back.

- **`backend/`**: a REST API built with Node.js, Express, TypeScript and PostgreSQL. It handles OTP login, stores loans and calculates the summary.
- **`app/`**: a React Native app built with Expo. It runs in a web browser, on Android and on iOS.

> **Demo video:** [link](https://drive.google.com/file/d/1O-6xkaUS_JysiODd2i5tpoGiK_hs5Fgv/view?usp=sharing)

## Features

- **Phone + OTP login and signup.** The OTP is mocked: instead of sending an SMS, the backend prints it in its console.
- **Dashboard** with a summary card (total lent, total repaid, overdue amount, and what's still owed to you).
- **Filter** the list by All, Unpaid or Repaid.
- **Overdue highlighting** for unpaid loans past their due date, with how many days overdue.
- **Add a loan** from a dialog: friend's name, amount, lent-on date (defaults to today) and due date, with calendar pickers.
- **Loan details** dialog with a "Mark repaid" button.
- **Input validation** in the app and on the server, using Zod in both.
- **Stays logged in** across restarts. The session is saved on the device and you can log out from the dashboard.

## Tech stack

| Part | Tools |
| --- | --- |
| Backend | Node.js, Express 5, TypeScript, PostgreSQL, Drizzle ORM, Zod, JSON Web Tokens |
| App | Expo (React Native), Expo Router, React Native Paper, React Hook Form, Zod, Axios |

## Prerequisites

- [Node.js](https://nodejs.org) 20 or newer (built with Node 24)
- [PostgreSQL](https://www.postgresql.org/download/) 14 or newer, running locally
- npm (comes with Node.js)

## Getting started

Clone the repo, then set up the backend first and the app second.

### 1. Backend

```bash
cd backend
npm install
```

Create the database:

```bash
psql -U postgres -c "CREATE DATABASE miniledger;"
```

Copy the example env file and fill it in:

```bash
cp .env.example .env
```

| Variable | What it is |
| --- | --- |
| `PORT` | Port the API listens on. Defaults to `4000`. |
| `DATABASE_URL` | PostgreSQL connection string, e.g. `postgres://postgres:password@localhost:5432/miniledger` |
| `JWT_SECRET` | Any long random string, used to sign login tokens. |

Create the tables by running the SQL migrations in `backend/drizzle/`:

```bash
npm run db:migrate
```

Start the API in development mode:

```bash
npm run dev
```

You should see `PostgreSQL connected` and `miniledger backend listening on http://localhost:4000`. Leave this terminal open: OTP codes are printed here.

### 2. App

In a second terminal:

```bash
cd app
npm install
```

The app calls the API at `http://localhost:4000` by default. If your backend runs on a different port or machine, create `app/.env.local`:

```bash
EXPO_PUBLIC_API_URL=http://localhost:4000
```

Start the app in your browser:

```bash
npm run web
```

To run it on a phone instead, start Expo with `npm start` and scan the QR code with the [Expo Go](https://expo.dev/go) app. On a phone, `localhost` means the phone itself, so set `EXPO_PUBLIC_API_URL` to your computer's local network IP (e.g. `http://192.168.1.10:4000`). The phone and computer must be on the same Wi-Fi.

### 3. Try it out

1. Open the app and choose **Create an account**.
2. Enter your name and a 10-digit Indian mobile number (starting with 6–9), then tap **Send OTP**.
3. Look in the backend terminal for a line like `[OTP] 9876543210: 4821` and enter that code.
4. You're on the dashboard. Tap **Add loan** to record your first loan.

OTPs are 4 digits and expire after 5 minutes. Login tokens last 2 days.

## API reference

All responses use this shape:

```json
{ "statusCode": 200, "success": true, "message": "Loan summary", "data": { } }
```

| Method | Path | Auth | Body / query | Description |
| --- | --- | --- | --- | --- |
| `GET` | `/health` | No | | Health check |
| `POST` | `/users/sendOtp` | No | `{ phone }` | Generate an OTP and print it in the server log |
| `POST` | `/users/register` | No | `{ phone, name, otp }` | Create an account; returns `{ user, token }` |
| `POST` | `/users/login` | No | `{ phone, otp }` | Log in; returns `{ user, token }` |
| `GET` | `/loans` | Yes | `?status=all\|unpaid\|repaid` | List your loans, newest first |
| `POST` | `/loans/addLoanEntry` | Yes | `{ friend_name, amount, due_date, lent_on? }` | Add a loan. Dates are `YYYY-MM-DD`; `lent_on` defaults to today |
| `POST` | `/loans/repayLoan` | Yes | `{ id }` | Mark a loan as repaid |
| `GET` | `/loans/summary` | Yes | | `{ total_lent, total_repaid, overdue_amount }` |

## Project structure

```
miniledger/
├── backend/
│   └── src/
│       ├── app.ts            Express app and server startup
│       ├── routes/           URL → middleware → controller
│       ├── controllers/      Read the request, call a service, send the response
│       ├── services/         Business logic and database queries
│       ├── validators/       Zod schemas for request bodies and queries
│       ├── middlewares/      Auth, validation and error handling
│       └── db/schema/        Drizzle table definitions (users, otps, loans)
└── app/
    └── src/
        ├── app/              Screens (Expo Router): login, signup, dashboard
        ├── components/       Auth form, loan list item, summary card, dialogs
        ├── context/          Auth state (current user, sign in, sign out)
        ├── services/         API calls
        ├── lib/              Axios instance, session storage, date and money helpers
        └── schemas/          Zod schemas for the forms
```

## Scripts

**Backend** (`backend/`)

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the API with auto-reload |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run the compiled API (run `build` first) |
| `npm run typecheck` | Type-check without building |
| `npm run db:migrate` | Apply the SQL migrations in `drizzle/` to the database |
| `npm run db:generate` | Create a new migration after changing `src/db/schema/` |
| `npm run db:studio` | Open Drizzle Studio to browse the database |

**App** (`app/`)

| Command | What it does |
| --- | --- |
| `npm run web` | Run the app in a browser |
| `npm start` | Start Expo (for Expo Go on a phone, or an emulator) |
| `npm run android` / `npm run ios` | Start Expo and open Android or iOS |
| `npm run lint` | Lint the app |
