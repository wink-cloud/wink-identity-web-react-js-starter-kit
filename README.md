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

Contact Wink Identity support if credentials are required.

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

4.  Update SDK configuration in `.env`

``` env
REACT_APP_CLIENT_ID=__client_id__
REACT_APP_REALM=__realm__
REACT_APP_SECRET=__secret__
```

5.  Start the development server

``` bash
npm start
```

App will run on:

http://localhost:3000

------------------------------------------------------------------------

## 🔧 Configuration Options

Refer: https://www.npmjs.com/package/wink-identity-sdk

SDK configuration is initialized inside the verification component.

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

For integration help, contact:

Wink Identity Engineering Team
