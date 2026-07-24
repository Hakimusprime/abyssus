import { HTMLAttributes, forwardRef } from "react"
import { cn } from "./Button"

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "glass-card rounded-lg text-text transition-all duration-300 hover:border-gold/50 hover:shadow-gold-glow hover:-translate-y-1",
        className,
      )}
      {...props}
    />
  ),
)
Card.displayName = "Card"

export const CardHeader =
  forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
      <div
        ref={ref}
        className={cn("flex flex-col space-y-1.5 p-6", className)}
        {...props}
      />
    ),
  )
CardHeader.displayName = "CardHeader"

export const CardTitle =
  forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLHeadingElement>>(
    ({ className, ...props }, ref) => (
      <h3
        ref={ref}
        className={cn(
          "font-display text-xl leading-none tracking-tight text-gold",
          className,
        )}
        {...props}
      />
    ),
  )
CardTitle.displayName = "CardTitle"

export const CardContent =
  forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
      <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
    ),
  )
CardContent.displayName = "CardContent"
