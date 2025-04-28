"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 py-8 sm:py-12 md:py-16 lg:py-24">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="n26-container relative px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center">
          {/* Left side - Text content */}
          <div className="space-y-6 sm:space-y-8 animate-slide-up text-center lg:text-left">
            <h1 className="gradient-text text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
              Banking. But better.
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-md mx-auto lg:mx-0">
              Start banking in minutes. Open your Ulster Delt account and move your recurring payments from your old account with a few taps.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <Link
                href="/products/standard"
                className="btn-primary w-full sm:w-auto"
              >
                Open Account
              </Link>
              <Link
                href="/products/compare"
                className="btn-secondary w-full sm:w-auto"
              >
                Compare Plans
              </Link>
            </div>
            
            {/* Trust indicators */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 pt-4 justify-center lg:justify-start">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <span className="text-sm sm:text-base font-medium">Bank-grade Security</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-sm sm:text-base font-medium">Instant Transfers</span>
              </div>
            </div>
          </div>

          {/* Right side - Interactive Card */}
          <div className="relative h-[300px] xs:h-[350px] sm:h-[400px] md:h-[450px] lg:h-[500px] w-full max-w-[90vw] mx-auto">
            <div className="absolute inset-0 z-10 animate-fade-in">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="glass-effect p-4 sm:p-6 rounded-2xl shadow-xl w-[280px] sm:w-[320px] card-hover">
                  <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-primary via-secondary to-accent flex items-center justify-center text-white font-bold text-sm sm:text-base">
                      UD
                    </div>
                    <div>
                      <p className="font-medium text-base sm:text-lg">Main account</p>
                      <p className="text-sm text-muted-foreground">€1,500.10</p>
                    </div>
                  </div>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                      <div className="flex flex-col items-center justify-center bg-white/50 dark:bg-black/50 p-2 sm:p-3 rounded-xl hover:bg-white/70 dark:hover:bg-black/70 transition-colors">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-primary mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        <span className="text-[10px] sm:text-xs font-medium">Send</span>
                      </div>
                      <div className="flex flex-col items-center justify-center bg-white/50 dark:bg-black/50 p-2 sm:p-3 rounded-xl hover:bg-white/70 dark:hover:bg-black/70 transition-colors">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-secondary mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="text-[10px] sm:text-xs font-medium">Request</span>
                      </div>
                      <div className="flex flex-col items-center justify-center bg-white/50 dark:bg-black/50 p-2 sm:p-3 rounded-xl hover:bg-white/70 dark:hover:bg-black/70 transition-colors">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-accent mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="text-[10px] sm:text-xs font-medium">Split</span>
                      </div>
                    </div>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex items-center justify-between bg-white/50 dark:bg-black/50 p-3 sm:p-4 rounded-xl">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs sm:text-sm font-medium">Café Latte</p>
                            <p className="text-[10px] sm:text-xs text-muted-foreground">Today</p>
                          </div>
                        </div>
                        <p className="text-xs sm:text-sm font-medium text-destructive">-€3.50</p>
                      </div>
                      <div className="flex items-center justify-between bg-white/50 dark:bg-black/50 p-3 sm:p-4 rounded-xl">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs sm:text-sm font-medium">Grocery Store</p>
                            <p className="text-[10px] sm:text-xs text-muted-foreground">Yesterday</p>
                          </div>
                        </div>
                        <p className="text-xs sm:text-sm font-medium text-destructive">-€32.75</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-secondary/20 to-accent/20 mix-blend-overlay rounded-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
