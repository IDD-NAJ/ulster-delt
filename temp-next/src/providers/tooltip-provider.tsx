"use client"

import { TooltipProvider } from "@/components/ui/tooltip"

interface TooltipProviderProps {
  children: React.ReactNode
}

export function TooltipsProvider({ children }: TooltipProviderProps) {
  return <TooltipProvider>{children}</TooltipProvider>
} 