import React from "react";
import { Helmet } from "react-helmet";
import { SignUp } from "@clerk/clerk-react";

import { BaseLayout } from "../layouts/BaseLayout";

import "./Auth.scss";

export function Signup() {
    return (
        <BaseLayout className="page-auth">
            <Helmet>
                <title>Create Jukebox account</title>
            </Helmet>

            <SignUp signInUrl="/login" />

        </BaseLayout>
    );
}
