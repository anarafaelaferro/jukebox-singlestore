import React from "react";
import { cva, VariantProps } from "class-variance-authority";

// Flex variants for direction, alignItems, justifyContent, and wrap
const flexDirection = {
  "row": "flex-row",
  "row-reverse": "flex-row-reverse",
  "column": "flex-column",
  "column-reverse": "flex-column-reverse",
} as const;

const alignItems = {
  "center": "align-items-center",
  "start": "align-items-start",
  "end": "align-items-end",
  "space-between": "align-items-space-between",
  "stretch": "align-items-stretch",
} as const;

const justifyContent = {
  "center": "justify-content-center",
  "start": "justify-content-start",
  "end": "justify-content-end",
  "space-between": "justify-content-space-between",
  "stretch": "justify-content-stretch",
} as const;

const wrap = {
  "wrap": "flex-wrap",
  "no-wrap": "flex-no-wrap",
} as const;

const flex = cva("", {
  variants: {
    direction: {
      sm: flexDirection,
      md: flexDirection,
      lg: flexDirection
    },
    alignItems: {
      sm: alignItems,
      md: alignItems,
      lg: alignItems,
    },
    justifyContent,
    wrap,
  },
});
