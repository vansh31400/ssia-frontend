import React from 'react'
import ReactDOM from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from './App.jsx'
import './index.css'

// IMPORTANT: For production, put your actual Google Client ID here or in a .env file
// e.g. import.meta.env.VITE_GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_ID = "842729979530-nt78n76ra7ujt5jsf79muagegps6jes3.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <App />
        </GoogleOAuthProvider>
    </React.StrictMode>,
)
