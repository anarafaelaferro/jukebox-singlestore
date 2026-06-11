import React from "react";

import { Navigation } from "../components/Navigation/Navigation";
import { Footer } from "../components/Footer/Footer";

import "./BaseLayout.scss";

type BaseLayoutProps = {
    className?: string;
};

export function BaseLayout({
    className,
    children,
}: React.PropsWithChildren<BaseLayoutProps>) {
    return (
        <div className="base-layout">
            <Navigation />

            <main className={className}>{children}</main>

            <Footer />
        </div>
    );
}
