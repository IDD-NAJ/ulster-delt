'use client';

import { ReactNode } from 'react';
import Image from 'next/image';

interface HeroProps {
  title: string;
  subtitle: string;
  imagePath: string;
  children?: ReactNode;
}

export function Hero({ title, subtitle, imagePath, children }: HeroProps) {
  return (
    <div className="relative overflow-hidden min-h-[300px] sm:min-h-[400px] bg-gray-900">
      <div className="absolute inset-0">
        <Image
          src={imagePath}
          alt="Hero background"
          fill
          priority
          className="object-cover opacity-75"
          sizes="100vw"
        />
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to right, rgba(17,24,39,0.9), rgba(17,24,39,0.8), rgba(17,24,39,0.7))'
          }}
        />
      </div>
      
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:py-32 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-white drop-shadow-lg px-2">
            {title}
          </h1>
          <p className="mx-auto mt-4 sm:mt-6 max-w-3xl text-base sm:text-lg lg:text-xl text-gray-100 drop-shadow-lg px-4 sm:px-6">
            {subtitle}
          </p>
          {children && (
            <div className="mt-6 sm:mt-8 lg:mt-10 relative z-10">
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 