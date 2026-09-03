# Grand Hotel Frontend

React and Vite frontend for the Grand Hotel reservation and hotel-operations platform. The application serves guests, front-desk staff, managers, and Superadmins through one responsive interface with role-aware navigation and workflows.

The frontend expects the FastAPI backend from `grand-hotel-backend` to be running locally on port `8000`.

## User Experience

- Browse available rooms and room types
- Register and sign in with JWT authentication
- Create reservations with a three-step booking flow
- Search guests by name, email, or phone when staff book on someone’s behalf
- Search available rooms and synchronize check-in, check-out, and number of nights
- Pay a deposit, pay in full, or defer payment for five days
- View reservation status and payment information
- Manage guest profiles as staff or managers
- Use the Superadmin control center for hotel status, RBAC, people, rooms, and room types

## Technology

- React 18
- React Router 6
- Vite 5
- Tailwind CSS 3
- React Icons
- SweetAlert2
- Fetch API with a shared API client

## Prerequisites

- Node.js 18 or newer
- npm
- The backend running at `http://localhost:8000`

## Installation

```bash
cd Grand-Hotel
npm install
```

## Environment Configuration

Create `Grand-Hotel/.env` if you want to call a backend directly:

```dotenv
VITE_API_URL=http://localhost:8000/api
```

If `VITE_API_URL` is omitted, the frontend uses `/api`. In development, Vite proxies `/api` to `http://localhost:8000` using `vite.config.js`.

Do not put private backend secrets, database passwords, JWT secrets, M-Pesa secrets, or Flutterwave secret keys in the frontend `.env`. Vite variables are available to browser code.

## Run the Frontend

```bash
npm run dev
```

Open `http://localhost:5173`.

The normal local setup uses two terminals.

Terminal 1, backend:

```bash
cd grand-hotel-backend
source venv/bin/activate
uvicorn main:app --reload --port 8000
```

Terminal 2, frontend:

```bash
cd Grand-Hotel
npm run dev
```

## Production Build

```bash
npm run build
npm run preview
```

The generated production files are written to `dist/`. The build only compiles the frontend; the API must be deployed separately.

## Deploy to Vercel

The frontend is a static Vite application and is intended to be deployed as a
Vercel project. Deploy the `Grand-Hotel` directory, or set it as the Vercel
project's **Root Directory** when importing the repository.

Use these project settings:

| Setting          | Value           |
| ---------------- | --------------- |
| Framework preset | Vite            |
| Build command    | `npm run build` |
| Output directory | `dist`          |
| Install command  | `npm install`   |

Add this Vercel environment variable for **Production**, **Preview**, and
**Development** as appropriate:

```dotenv
VITE_API_URL=https://YOUR-RENDER-SERVICE.onrender.com/api
```

The value must end in `/api`, because the API wrappers call paths such as
`/rooms` and `/auth/login`. Vite embeds `VITE_*` values into browser code, so
never put private credentials in this variable or in any frontend environment
file.

After changing a Vercel environment variable, create a new deployment. Test
the deployed site by opening `/`, `/login`, `/rooms`, and `/admin` directly.
Superadmin login should open the dedicated admin command desk.

### Vercel routing

`vercel.json` proxies `/api/*` to the current Render API URL. If the Render
service URL changes, update that destination and redeploy, or remove the rewrite
and rely entirely on `VITE_API_URL`. Keep the rewrite limited to `/api/*` so
Vercel serves the React application for normal frontend routes.

### Production connection checklist

- [ ] Render API is live at `/` and `/docs`
- [ ] `VITE_API_URL` is set to the Render API URL ending in `/api`
- [ ] Render CORS allows the exact Vercel production origin
- [ ] A production build succeeds with `npm run build`
- [ ] Login, room browsing, reservations, payments, and `/admin` are tested
- [ ] Preview deployments use a backend environment that is safe for testing
- [ ] No backend secrets or database credentials are stored in Vercel

## Available Scripts

| Command           | Purpose                              |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start the Vite development server    |
| `npm run build`   | Create a production build            |
| `npm run preview` | Preview the production build locally |
| `npm run lint`    | Run ESLint across the project        |

## Application Routes

| Route           | Audience                    | Purpose                                                         |
| --------------- | --------------------------- | --------------------------------------------------------------- |
| `/`             | Everyone                    | Hotel home page                                                 |
| `/rooms`        | Everyone                    | Browse available rooms and open a reservation                   |
| `/reservations` | Authenticated users         | View own or management reservations                             |
| `/guests`       | Staff, managers, Superadmin | Guest directory and profile status management                   |
| `/admin`        | Superadmin                  | Control center for reports, RBAC, people, rooms, and room types |
| `/about`        | Guests and public users     | Hotel information                                               |
| `/feedback`     | Guests and public users     | Feedback page                                                   |
| `/login`        | Everyone                    | Sign in                                                         |
| `/register`     | Everyone                    | Create a guest account                                          |

About and Feedback are intentionally hidden from staff, managers, and Superadmins because those roles use operational views.

## Authentication Flow

1. Open `/login`.
2. Submit an email and password to `POST /api/auth/login`.
3. The frontend stores the returned JWT in `localStorage` under `token`.
4. The shared API client sends it as `Authorization: Bearer <token>`.
5. JWT permissions are decoded into `AuthContext` for role-aware UI decisions.
6. The backend remains the final authority and can reject unauthorized requests.

When role permissions change, log out and sign in again so the frontend receives a fresh token.

## Reservation Workflow

The reservation modal has three steps.

### 1. Booking guest

- Guests use their own linked guest profile.
- Managers and Superadmins can add a new walk-in guest.
- Existing guests can be searched by name, email, or phone number.
- Existing emails are reused instead of creating duplicate guest accounts.

### 2. Room and dates

- Only active rooms marked `available` are shown.
- Rooms can be searched by room number or room type.
- Entering nights calculates the check-out date.
- Entering check-out calculates the number of nights.

### 3. Payment

- Pay the deposit.
- Pay the full reservation amount.
- Skip payment and hold the reservation for five days.
- Select M-Pesa, card, cash, or bank transfer where supported by the backend.

The backend validates availability, pricing, payment status, and reservation transitions regardless of what the frontend displays.

## Role Workflows

### Guest

- Browse rooms
- Create a reservation
- Pay the deposit or full amount
- View own reservations
- Cancel eligible reservations

### Staff or Manager

- View hotel reservations
- Search and manage guest profiles
- Book rooms for existing or walk-in guests
- Complete check-in, check-out, confirmation, and cancellation actions permitted by their role

### Superadmin

Open `/admin` or choose **Control Center** from the navigation. The control center includes:

- Overview metrics and hotel pulse visualizations
- Reservation status summaries
- Roles and permission assignment
- Role creation
- Manager and user creation under a selected role
- Room-type creation
- Room creation with a room-type selector
- Guest and manager summaries

## API Client

All API requests use `src/api/client.js`.

```javascript
import { apiClient } from "./api/client";

const response = await apiClient("/rooms", {
  params: { room_availability: "available" },
});

console.log(response.data);
```

The client handles JSON bodies, JWT authorization, query parameters, FastAPI response envelopes, 401 logout behavior, and backend error messages.

## Project Structure

```text
Grand-Hotel/
├── public/                         # Static images and public assets
├── src/
│   ├── api/                        # Backend API wrappers
│   ├── components/
│   │   ├── common/                 # Modal, loading, prompts, status badges
│   │   ├── home/                   # Homepage sections
│   │   ├── layout/                 # Navbar and footer
│   │   └── reservations/           # Booking and payment dialogs
│   ├── context/                    # Authentication state and permissions
│   ├── pages/                      # Routed screens
│   ├── utils/                      # Constants and formatters
│   ├── App.jsx                     # Routes and application shell
│   ├── App.css                     # App-level styles
│   └── index.css                   # Tailwind entry and global styles
├── index.html
├── vite.config.js
├── tailwind.config.js
├── eslint.config.js
└── package.json
```

## Troubleshooting

### Rooms do not load

1. Confirm the backend is running on port `8000`.
2. Open `http://localhost:8000/docs` to verify the API.
3. Confirm the signed-in user has room-view permission.
4. Check that rooms have `status=true` and `room_availability=available`.

### Reservation fails with `Room is not available for booking`

The room was occupied, reserved, under maintenance, inactive, or became unavailable after the list loaded. Refresh the room list and choose another available room.

### Reservation fails with `Email already registered`

Search for the existing guest by email instead of creating a new guest. The backend also reuses an existing guest profile when the registration endpoint receives a known email.

### Reservation expires

Skipped payments are due within five days. Pending reservations are expired by the backend when reservation or availability operations run.

### Payment appears twice

The frontend reuses the reservation’s existing pending payment record. If duplicate records already exist from an earlier build, inspect them in the database before refunding or deleting anything.

### `401` or `403` responses

Sign out and sign in again after changing permissions. A JWT contains permissions from the time it was issued, while the backend also checks current database assignments.

### Frontend changes are not visible

Restart Vite after changing `.env` values:

```bash
npm run dev
```

Vite reads `VITE_*` variables at startup.

### Vercel shows an API error or a blank route

Check that `VITE_API_URL` includes `/api` and that the Render service is awake
and reachable. If only direct routes fail, inspect `vercel.json` and ensure it
rewrites `/api/*` only; a catch-all rewrite can send React routes to the API.

### CORS errors in production

The API must allow the exact Vercel origin, including `https://` and without a
trailing slash. Update the backend CORS configuration and redeploy the API; a
frontend-only redeploy cannot fix a server-side CORS rejection.

## Security Notes

- Never expose backend `.env` values in frontend code.
- Rotate credentials pasted into chats, issues, commits, or logs.
- Do not commit `.env` files.
- Use HTTPS and restricted CORS in production.
- Do not use seeded demo passwords in production.

## Development Checklist

```bash
# Terminal 1
cd grand-hotel-backend
source venv/bin/activate
alembic upgrade head
python -m app.commands.seed_all
uvicorn main:app --reload --port 8000

# Terminal 2
cd Grand-Hotel
npm install
npm run dev
```

Then open `http://localhost:5173`, sign in with a development account, and test the workflow appropriate to its role.
