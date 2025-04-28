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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-2">
      <h1 className="text-4xl font-bold mb-4 text-center">Live Chat</h1>
      <p className="text-lg text-gray-700 mb-8 text-center">A support agent will be with you shortly.</p>
      <div className="p-4 bg-white rounded shadow-md w-full max-w-lg mx-auto">
        <div className="w-full" style={{ position: 'relative', paddingBottom: '65%', height: 0 }}>
          <iframe
            src="https://direct.lc.chat/19146467/"
            title="LiveChat Widget"
            allow="autoplay; clipboard-write"
            style={{
              border: 'none',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%'
            }}
          />
        </div>
      </div>
    </div>
  );
} 