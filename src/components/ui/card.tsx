import * as React from "react"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      style={{
        borderRadius: "var(--radius)",
        backgroundColor: "hsl(var(--card))",
        color: "hsl(var(--card-foreground))",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        overflow: "hidden",
      }}
      {...props}
    />
  )
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "1.5rem 1.5rem 0 1.5rem",
      }}
      {...props}
    />
  )
)
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      style={{
        fontSize: "1.125rem",
        fontWeight: "600",
        lineHeight: "1.375rem",
        margin: "0",
      }}
      {...props}
    />
  )
)
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      style={{
        color: "hsl(var(--muted-foreground))",
        fontSize: "0.875rem",
        lineHeight: "1.25rem",
        margin: "0.5rem 0 0 0",
      }}
      {...props}
    />
  )
)
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      style={{
        padding: "1.5rem",
        paddingTop: "1rem",
      }}
      {...props}
    />
  )
)
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      style={{
        display: "flex",
        padding: "1.5rem",
        paddingTop: "0",
        flexWrap: "wrap",
        gap: "0.5rem",
      }}
      {...props}
    />
  )
)
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
