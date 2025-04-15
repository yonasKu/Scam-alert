import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "@/lib/utils"

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost" | "secondary" | "destructive" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
  children: React.ReactNode;
};

const getVariantStyles = (variant: ButtonProps["variant"] = "default") => {
  switch (variant) {
    case "default":
      return {
        backgroundColor: "hsl(var(--primary))",
        color: "hsl(var(--primary-foreground))",
      };
    case "outline":
      return {
        backgroundColor: "transparent",
        color: "hsl(var(--foreground))",
        border: "1px solid hsl(var(--border))",
      };
    case "ghost":
      return {
        backgroundColor: "transparent",
        color: "hsl(var(--foreground))",
      };
    case "secondary":
      return {
        backgroundColor: "hsl(var(--secondary))",
        color: "hsl(var(--secondary-foreground))",
      };
    case "destructive":
      return {
        backgroundColor: "hsl(var(--destructive))",
        color: "hsl(var(--destructive-foreground))",
      };
    case "link":
      return {
        backgroundColor: "transparent",
        color: "hsl(var(--primary))",
        textDecoration: "underline",
      };
    default:
      return {};
  }
};

const getSizeStyles = (size: ButtonProps["size"] = "default") => {
  switch (size) {
    case "default":
      return {
        height: "2.5rem",
        padding: "0 1rem",
      };
    case "sm":
      return {
        height: "2.25rem",
        padding: "0 0.75rem",
        fontSize: "0.875rem",
      };
    case "lg":
      return {
        height: "2.75rem",
        padding: "0 2rem",
        fontSize: "1.125rem",
      };
    case "icon":
      return {
        height: "2.5rem",
        width: "2.5rem",
        padding: 0,
      };
    default:
      return {};
  }
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const baseStyles: React.CSSProperties = {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      whiteSpace: "nowrap",
      borderRadius: "0.375rem",
      fontWeight: 500,
      transition: "background-color 0.2s, border-color 0.2s, color 0.2s",
      cursor: "pointer",
      border: "none",
      outline: "none",
      ...getVariantStyles(variant),
      ...getSizeStyles(size),
    };

    if (asChild && React.isValidElement(children)) {
      // For Link element, we'll apply styles to the child
      return React.cloneElement(children, {
        style: { ...baseStyles, ...(children.props.style || {}) },
        ...props,
      });
    }

    return (
      <button ref={ref} style={baseStyles} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export const buttonVariants = {}; // Keep for compatibility
