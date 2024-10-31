import React from "react";
import { Navigation } from "../components/Navigation/Navigation";

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

            <div className={className}>{children}</div>
        </div>
    );
}
