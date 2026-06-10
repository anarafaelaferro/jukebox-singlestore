import React from "react";
import { cva, VariantProps } from "class-variance-authority";

import "./Button.scss";

const buttonVariants = {
  "solid-brand": "button-variant-solid-brand",
  "solid-neutral": "button-variant-solid-neutral",
  "outline-brand": "button-variant-outline-brand",
  "outline-neutral": "button-variant-outline-neutral",
  "unstyled": "button-variant-unstyled",
}

const button = cva("button-component", {
  variants: {
    variant: buttonVariants,
    size: {
      small: "button-size-small",
      medium: "button-size-medium",
      large: "button-size-large",
    },
  },
});

type ButtonProps = VariantProps<typeof button> & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ variant = "solid-brand", size = "medium", children, ...rest }: React.PropsWithChildren<ButtonProps>) {
  const classes = button({ variant, size });
  return <button className={classes} {...rest}>{children}</button>;
}
