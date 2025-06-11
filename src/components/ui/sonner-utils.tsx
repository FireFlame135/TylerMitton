// sonner-utils.tsx
import type { ComponentProps } from "react"
import { Toaster as Sonner } from "sonner"

// Re-export the props type for our Toaster wrapper
export type ToasterProps = ComponentProps<typeof Sonner>

// Re-export the raw toast function for use elsewhere
export { toast } from "sonner"
