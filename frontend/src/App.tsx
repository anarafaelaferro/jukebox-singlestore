import React from "react";
import { Routes, Route } from "react-router-dom";
import { ClerkProvider } from '@clerk/clerk-react';

import { About } from "./pages/About";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Homepage } from "./pages/Homepage";

function App() {
    // Import your Publishable Key
    const PUBLISHABLE_KEY = process.env.REACT_APP_VITE_CLERK_PUBLISHABLE_KEY;

    if (!PUBLISHABLE_KEY) {
        throw new Error("Missing Publishable Key")
    }
    
    return (
        <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route path="/singup" element={<Signup />} />
            </Routes>
        </ClerkProvider>
    );
}

export default App;
