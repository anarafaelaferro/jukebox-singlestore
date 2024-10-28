import React from "react";

import "./BaseLayout.scss";

type BaseLayoutProps = {
  className?: string;
};

export function BaseLayout({ className, children }: React.PropsWithChildren<BaseLayoutProps>) {
  return (
    <div className="base-layout">
      <div className={className}>
        {children}
      </div>
    </div>
  );
}
