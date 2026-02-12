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

> **Security note:** In this starter kit, the Wink Login SDK is configured entirely on the frontend so that you can run an end-to-end flow quickly in development. For production integrations, we recommend moving any sensitive Wink session or token handling to your backend and using this configuration only as a reference example.

------------------------------------------------------------------------

## 🧪 Testing Flow

1.  Launch the application
2.  Click **Start Verification**
3.  Perform face/liveness check
4.  Receive success response

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
