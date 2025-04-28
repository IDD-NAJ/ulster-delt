'use client';

import { useState, useEffect, useRef } from 'react';
import type { Card } from '@prisma/client';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface CardSliderProps {
  cards: Card[];
}

export default function CardSlider({ cards }: CardSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageError, setImageError] = useState<Record<string, boolean>>({});
  const [isHovered, setIsHovered] = useState(false);
  const preloadTimeout = useRef<NodeJS.Timeout>();

  // Preload next and previous images
  useEffect(() => {
    const preloadImages = () => {
      const nextIndex = (currentIndex + 1) % cards.length;
      const prevIndex = (currentIndex - 1 + cards.length) % cards.length;
      
      const nextCard = cards[nextIndex];
      const prevCard = cards[prevIndex];

      if (nextCard) {
        const nextImg = new window.Image();
        nextImg.src = `/images/cards/${nextCard.type.toLowerCase()}.png`;
      }

      if (prevCard) {
        const prevImg = new window.Image();
        prevImg.src = `/images/cards/${prevCard.type.toLowerCase()}.png`;
      }
    };

    preloadTimeout.current = setTimeout(preloadImages, 500);
    return () => clearTimeout(preloadTimeout.current);
  }, [currentIndex, cards]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + cards.length) % cards.length);
  };

  const handleImageError = (cardId: string) => {
    setImageError(prev => ({ ...prev, [cardId]: true }));
  };

  const getCardTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      credit: 'bg-blue-500',
      debit: 'bg-green-500',
      virtual: 'bg-purple-500',
      business: 'bg-orange-500',
      premium: 'bg-yellow-500',
      student: 'bg-pink-500'
    };
    return colors[type.toLowerCase()] || 'bg-gray-500';
  };

  if (!cards.length) {
    return (
      <div className="bg-gray-100 rounded-lg p-6 text-center">
        <p className="text-gray-600">No cards available</p>
      </div>
    );
  }

  return (
    <div 
      className="relative bg-white rounded-lg shadow-md p-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h3 className="text-lg font-semibold mb-4">Your Cards</h3>
      <div className="relative h-48">
        <AnimatePresence mode="wait">
          {cards.map((card, index) => (
            index === currentIndex && (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
                className="absolute w-full h-full"
              >
                <div className="relative h-full">
                  {!imageError[card.id] ? (
                    <Image
                      src={`/images/cards/${card.type.toLowerCase()}.png`}
                      alt={`${card.type} Card`}
                      fill
                      className="object-contain"
                      onError={() => handleImageError(card.id)}
                      priority={index === currentIndex}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <p className="text-gray-500">Card image not available</p>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm">**** **** **** {card.lastFourDigits}</p>
                        <p className="text-xs">
                          Expires: {card.expiryMonth}/{card.expiryYear}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${getCardTypeColor(card.type)}`}>
                        {card.type}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          ))}
        </AnimatePresence>
      </div>
      <div className="flex justify-between mt-4">
        <button
          onClick={prevSlide}
          className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={cards.length <= 1}
        >
          Previous
        </button>
        <div className="flex space-x-2">
          {cards.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
              }`}
              aria-label={`Go to card ${index + 1}`}
            />
          ))}
        </div>
        <button
          onClick={nextSlide}
          className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={cards.length <= 1}
        >
          Next
        </button>
      </div>
      {isHovered && (
        <div className="absolute top-2 right-2 flex space-x-2">
          <button
            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
            onClick={() => {/* Add card details action */}}
            aria-label="View card details"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button
            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
            onClick={() => {/* Add card settings action */}}
            aria-label="Card settings"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
} 