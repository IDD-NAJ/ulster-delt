"use client";
import React, { useEffect } from 'react';

export default function LiveChatPage() {
  useEffect(() => {
    if (!document.getElementById('lc-chat-script')) {
      const script = document.createElement('script');
      script.id = 'lc-chat-script';
      script.src = 'https://cdn.livechatinc.com/tracking.js';
      script.async = true;
      document.body.appendChild(script);

      // Optionally, you can also embed the direct chat iframe for instant access
      // Or just let the widget load as usual
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-4xl font-bold mb-4">Live Chat</h1>
      <p className="text-lg text-gray-700 mb-8">A support agent will be with you shortly.</p>
      <div className="p-6 bg-white rounded shadow-md w-full max-w-lg">
        <iframe
          src="https://direct.lc.chat/19146467/"
          width="100%"
          height="400"
          style={{ border: 'none' }}
          title="LiveChat Widget"
          allow="autoplay; clipboard-write"
        />
      </div>
    </div>
  );
} 