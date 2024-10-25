import React from "react";

import "./BaseLayout.scss";

export function BaseLayout({ children }: React.PropsWithChildren) {
  return (
    <div className="base-layout">
      {children}
    </div>
  );
}
