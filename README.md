# wink-identity-web-react-js-starter-kit

React JS starter kit for integrating the **Wink Identity Web SDK** into
web applications using reusable components and modern React
architecture.

This project provides a reference implementation for launching identity
verification flows such as face capture and liveness authentication
within a React environment.

------------------------------------------------------------------------

## 🚀 Features

-   Wink Identity Web SDK integration
-   Face capture & liveness checks
-   Built with React and **TypeScript**
-   Reusable components & hooks
-   Lightweight & customizable UI
-   Sample verification journey

------------------------------------------------------------------------

## 📂 Project Structure

    wink-identity-web-react-js-starter-kit/
    │
    ├── public/
    ├── src/
    │   ├── components/   (WinkAuthProvider)
    │   ├── contexts/     (WinkContext)
    │   ├── hooks/        (useWinkAuth)
    │   ├── lib/          (winkAuth helpers and constants)
    │   ├── types/        (Wink auth types)
    │   ├── App.tsx
    │   ├── main.tsx
    │   └── index.css
    ├── .env.example
    ├── package.json
    └── README.md

------------------------------------------------------------------------

## 🛠️ Prerequisites

-   Node.js (v16+ recommended)
-   Wink Identity API Credentials
-   Verification workflow configured
-   SDK access enabled

Contact Wink Identity support using the channels listed in the Wink Developer Hub if credentials are required: https://docs.wink.cloud/.

------------------------------------------------------------------------

## ▶️ Getting Started

1.  Clone the repository

``` bash
git clone https://github.com/wink-cloud/wink-identity-web-react-js-starter-kit.git
```

2.  Open the project

``` bash
cd wink-identity-web-react-js-starter-kit
```

3.  Install dependencies

``` bash
npm install
```

4.  Run the **backend** (session and user are only available via backend; see [Using the backend](#using-the-backend)).

5.  Update configuration in `.env` (or `.env.local`). Use **staging** endpoints for onboarding; the client secret is **not** used in the frontend.

``` env
VITE_WINK_CLIENT_ID=__client_id__
VITE_WINK_REALM=__realm__
VITE_WINK_BASE_URL=https://stagelogin-api.winkapis.com
VITE_WINK_AUTH_URL=https://stageauth.winkapis.com
VITE_WINK_BACKEND_URL=http://localhost:8080
```

6.  Start the development server

``` bash
npm run dev
```

App will run on:

http://localhost:3000

------------------------------------------------------------------------

## 🔧 Configuration Options

Refer: https://www.npmjs.com/package/wink-identity-sdk and the Wink Developer Hub:

-   https://docs.wink.cloud/
-   https://docs.wink.cloud/docs/front-end-integration

The app uses these environment variables (no client secret in the frontend):

-   `VITE_WINK_CLIENT_ID`
-   `VITE_WINK_REALM`
-   `VITE_WINK_BASE_URL`
-   `VITE_WINK_AUTH_URL`
-   `VITE_WINK_BACKEND_URL` **(required)** – backend that creates the session and returns user profile; the client secret is only used on the backend.

### Using the backend (required)

Use the **Wink Identity Backend Templates** repo (e.g. Express starter). The backend exposes:

- **GET /session?returnUrl=...&cancelUrl=...** – creates a Wink session (used before login).
- **GET /user?clientId=...&token=...** – returns user profile (used after auth).

1. Clone and run the backend (e.g. `express-starter-kit`):
   ```bash
   cd path/to/wink-identity-backend-templates/express-starter-kit
   cp .env.example .env.local
   # Edit .env.local: WINK_IDENTITY_BASE_URL, WINK_IDENTITY_CLIENT_ID, WINK_IDENTITY_SECRET
   npm install && npm run dev
   ```
2. In this React app, set in `.env` or `.env.local`:
   ```env
   VITE_WINK_BACKEND_URL=http://localhost:8080
   ```
3. Session is obtained from the backend before calling `winkLogin()`; user profile is always fetched from the backend after authentication.

**Verifying the backend**

- **Browser:** Click **Login with Wink**, then open DevTools → **Network**. Select the request to `GET .../session?returnUrl=...&cancelUrl=...` and check **Response**: you should see a JSON body (e.g. with a session identifier).
- **curl:** With the backend running, run (replace the origin with your frontend origin if different):
  ```bash
  curl -s "http://localhost:8080/session?returnUrl=http://localhost:3000/&cancelUrl=http://localhost:3000/callback"
  ```
  You should get a JSON response. The exact property name for the session id depends on the Wink API (e.g. `sessionId`, `SessionId`, or `id`); the frontend reads it and passes it to the SDK. The redirect URL to the Wink IdP may not show this id in the query string; it can be used by the SDK/backend in the flow.

### Official npm-first integration approach

This starter kit is designed to maximize usage of the `wink-identity-sdk` package as the official integration path:

-   `winkInit()` for SDK initialization and SSO check
-   `winkLogin()` for authentication (session is obtained from your backend before calling it)
-   `winkLogout()` / OIDC logout for sign out
-   User profile is fetched via your backend (`GET /user`)
-   Session is created via your backend (`GET /session`) before login

For logout hardening, this starter uses standards-based OIDC logout URL redirection.

### User profile demonstration

After successful authentication, the UI displays the profile returned by your backend (`GET /user`), including:

-   `firstName`
-   `lastName`
-   `email`
-   `contactNo`
-   `winkTag`
-   `winkToken`
-   `expiryTime`

------------------------------------------------------------------------

## 🧪 Testing Flow

1.  Launch the application
2.  Click **Login with Wink**
3.  Complete the Wink authentication flow
4.  Confirm the `Status` is `authenticated`
5.  Confirm the **Authenticated User Profile** panel is rendered in the app
6.  Click **Refresh Profile** to re-fetch profile data from the backend
7.  Click **Logout** to clear local session artifacts and profile data

> **Logout behavior note:** Wink supports browser-local SSO. If the token/session is still valid, a new sign-in can be restored quickly after logout. This is expected behavior in OAuth/SSO flows.

------------------------------------------------------------------------

## ✅ Before going live

- Use **production** Wink API and Auth URLs (replace staging endpoints).
- Deploy the backend with `WINK_IDENTITY_*` set for production; restrict CORS to your frontend origin.
- Ensure `.env` (and secrets) are never committed; use your hosting’s env config.
- Run `npm run build` and test the production build locally with `npm run preview`.
- Run `npm run typecheck` to validate TypeScript types.

------------------------------------------------------------------------

## 📦 Deployment

Can be deployed on any React‑supported hosting:

-   Vercel
-   Netlify
-   AWS S3 + CloudFront
-   Firebase Hosting

Build command:

``` bash
npm run build
```

------------------------------------------------------------------------

## 📄 License

Internal / Partner Use -- Wink Identity

------------------------------------------------------------------------

## 🤝 Support

For integration help, contact Wink Identity support using the channels listed in the Wink Developer Hub: https://docs.wink.cloud/.
