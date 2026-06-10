import React from "react";
import { cva, VariantProps } from "class-variance-authority";

import "./Typography.scss";

const textVariants = {
  "display-1": "display-1",
  "display-2": "display-2",
  "heading-1": "heading-1",
  "heading-2": "heading-2",
  "heading-3": "heading-3",
  "heading-4": "heading-4",
  "heading-5": "heading-5",
  "heading-6": "heading-6",
  "body-1": "body-1",
  "body-2": "body-2",
  "body-3": "body-3",
  "body-4": "body-4",
} as const;

const textColors = {
  "low-contrast": "low-contrast",
  "mid-contrast": "mid-contrast",
  "high-contrast": "high-contrast",
  "brand-low-contrast": "brand-low-contrast",
  "brand-mid-contrast": "brand-mid-contrast",
  "brand-high-contrast": "brand-high-contrast",
} as const;

const fontFamily = {
  "serif": "font-family-serif",
  "sans-serif": "font-family-sans-serif",
};

const text = cva("", {
  variants: {
    variant: textVariants,
    color: textColors,
    fontFamily,
    weight: {
      normal: "font-weight-normal",
      medium: "font-weight-medium",
      bold: "font-weight-bold",
    },
  },
});

type TextProps = React.PropsWithChildren<
  VariantProps<typeof text> &
  {
    className?: string;
  }
>;

export function Paragraph ({ className, variant = "body-1", children, ...rest }: TextProps) {
  const classes = text({ class: className, variant, ...rest });
  return <p className={classes}>{children}</p>;
}

export function Span ({ className, variant, children, ...rest }: TextProps) {
  const classes = text({ class: className, variant, ...rest });
  return <span className={classes}>{children}</span>;
}

export function Bold ({ className, variant, children, ...rest }: TextProps) {
  const classes = text({ class: className, variant, weight: "bold", ...rest });
  return <b className={classes}>{children}</b>;
}

export function H1 ({ className, variant = "heading-1", children, ...rest }: TextProps) {
  const classes = text({ class: className, variant, ...rest });
  return <h1 className={classes}>{children}</h1>;
}

export function H2 ({ className, variant = "heading-2", children, ...rest }: TextProps) {
  const classes = text({ class: className, variant, ...rest });
  return <h2 className={classes}>{children}</h2>;
}

export function H3 ({ className, variant = "heading-3", children, ...rest }: TextProps) {
  const classes = text({ class: className, variant, ...rest });
  return <h3 className={classes}>{children}</h3>;
}

export function H4 ({ className, variant = "heading-4", children, ...rest }: TextProps) {
  const classes = text({ class: className, variant, ...rest });
  return <h4 className={classes}>{children}</h4>;
}

export function H5 ({ className, variant = "heading-5", children, ...rest }: TextProps) {
  const classes = text({ class: className, variant, ...rest });
  return <h5 className={classes}>{children}</h5>;
}

export function H6 ({ className, variant = "heading-6", children, ...rest }: TextProps) {
  const classes = text({ class: className, variant, ...rest });
  return <h6 className={classes}>{children}</h6>;
}
