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
-   Built with React JS
-   Reusable components & hooks
-   Lightweight & customizable UI
-   Sample verification journey

------------------------------------------------------------------------

## 📂 Project Structure

    wink-identity-web-react-js-starter-kit/
    │
    ├── public/
    ├── src/
    │   ├── App.jsx
    │   └── index.js
    ├── .env.local
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

4.  Update SDK configuration in `.env` (or `.env.local`)

``` env
VITE_WINK_CLIENT_ID=__client_id__
VITE_WINK_REALM=__realm__
VITE_WINK_SECRET=__secret__
VITE_WINK_BASE_URL=https://dev-api.winklogin.com
VITE_WINK_AUTH_URL=https://devauth.winklogin.com
```

5.  Start the development server

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

SDK configuration is initialized inside the verification component and uses the following environment variables:

-   `VITE_WINK_CLIENT_ID`
-   `VITE_WINK_REALM`
-   `VITE_WINK_SECRET`
-   `VITE_WINK_BASE_URL`
-   `VITE_WINK_AUTH_URL`

> **Security note:** This starter kit demonstrates a pure frontend integration for onboarding and testing. In production, sensitive operations (such as session creation and profile verification) should be handled by your backend according to your security and compliance requirements.

### Official npm-first integration approach

This starter kit is designed to maximize usage of the `wink-identity-sdk` package as the official integration path:

-   `winkInit()` for SDK initialization and SSO check
-   `winkLogin()` for authentication
-   `winkLogout()` / OIDC logout for sign out
-   `getUser()` for authenticated profile retrieval

No custom direct API calls are required for login and profile retrieval in the app code.  
For logout hardening, this starter uses standards-based OIDC logout URL redirection.

### User profile demonstration

After successful authentication, the UI displays the profile returned by `getUser()`, including:

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
6.  Click **Refresh Profile** to re-fetch profile data via SDK
7.  Click **Logout** to clear local session artifacts and profile data

> **Logout behavior note:** Wink supports browser-local SSO. If the token/session is still valid, a new sign-in can be restored quickly after logout. This is expected behavior in OAuth/SSO flows.

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
