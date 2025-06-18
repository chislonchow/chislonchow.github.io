import * as React from "react"
import { cn } from "@/lib/utils"

const Toolbar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    role="toolbar"
    aria-label="Controls toolbar"
    className={cn(
      "flex items-center gap-2", // Default styling, can be overridden
      className
    )}
    {...props}
  />
))
Toolbar.displayName = "Toolbar"

const ToolbarSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { orientation?: "horizontal" | "vertical" }
>(({ className, orientation = "vertical", ...props }, ref) => (
  <div
    ref={ref}
    role="separator"
    aria-orientation={orientation}
    className={cn(
      "shrink-0 bg-border",
      orientation === "vertical" ? "h-full w-[1px]" : "h-[1px] w-full",
      className
    )}
    {...props}
  />
));
ToolbarSeparator.displayName = "ToolbarSeparator";

export { Toolbar, ToolbarSeparator };
