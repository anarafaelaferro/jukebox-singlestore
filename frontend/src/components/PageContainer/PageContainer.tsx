import React from "react";

import "./PageContainer.scss";

export const PageContainer = ({ children }: React.PropsWithChildren) => {
  return <div className="page-container">{children}</div>;
}
