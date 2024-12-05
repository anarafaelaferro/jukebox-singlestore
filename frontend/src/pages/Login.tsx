import React from "react";
import { Helmet } from "react-helmet";
import { SignIn } from "@clerk/clerk-react";

import { BaseLayout } from "../layouts/BaseLayout";

import "./Auth.scss";

export function Login() {
    return (
        <BaseLayout className="page-auth">
            <Helmet>
                <title>Login Jukebox</title>
            </Helmet>

            <SignIn />

        </BaseLayout>
    );
}
