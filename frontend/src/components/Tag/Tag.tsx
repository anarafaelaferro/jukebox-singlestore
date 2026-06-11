import React from "react";

import "./Tag.scss";

export function Tag({ children }: React.PropsWithChildren) {
  return <div className="tag-component">{children}</div>;
}
