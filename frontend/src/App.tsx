import React from "react";
import axios from "axios";
import { Routes, Route } from "react-router-dom";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";

import { About } from "./pages/About";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { FriendsPage } from "./pages/Friends";
import { ProfilePage } from "./pages/Profile";
import { Homepage } from "./pages/Homepage";

function AuthSetup() {
    const { getToken } = useAuth();

    React.useEffect(() => {
        const interceptor = axios.interceptors.request.use(async (config) => {
            const method = config.method?.toLowerCase();

            // Only attach auth to mutations — avoids CORS preflight on GET requests
            if (method !== "post") {
                return config;
            }

            try {
                const token = await getToken();

                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            } catch (error) {
                console.error("Failed to attach auth token:", error);
            }

            return config;
        });

        return () => {
            axios.interceptors.request.eject(interceptor);
        };
    }, [getToken]);

    return null;
}

function App() {
    // Import your Publishable Key
    const PUBLISHABLE_KEY = process.env.REACT_APP_VITE_CLERK_PUBLISHABLE_KEY;

    if (!PUBLISHABLE_KEY) {
        throw new Error("Missing Publishable Key");
    }

    return (
        <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
            <AuthSetup />
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route path="/sign-up" element={<Signup />} />

                <Route path="/:username/friends" element={<FriendsPage />} />
                <Route path="/:username" element={<ProfilePage />} />
            </Routes>
        </ClerkProvider>
    );
}

export default App;
