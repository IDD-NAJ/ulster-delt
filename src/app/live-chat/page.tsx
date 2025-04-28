"use client";
import React, { useEffect } from 'react';

export default function LiveChatPage() {
  useEffect(() => {
    // Replace YOUR_LICENSE_NUMBER with your actual LiveChat license number
    if (!document.getElementById('livechat-script')) {
      const script = document.createElement('script');
      script.id = 'livechat-script';
      script.innerHTML = `
        window.__lc = window.__lc || {};
        window.__lc.license = 19146467;
        (function(n,t,c){function i(n){return e._h?e._h.apply(null,n):e._q.push(n)}var e={_q:[],_h:null,_v:"2.0",on:function(){i(["on"].concat([].slice.call(arguments)))},once:function(){i(["once"].concat([].slice.call(arguments)))},off:function(){i(["off"].concat([].slice.call(arguments)))},get:function(){if(!e._h)throw new Error("LiveChatWidget: the widget is not initialized yet");return i(["get"].concat([].slice.call(arguments)))},call:function(){i(["call"].concat([].slice.call(arguments)))}},o=n["__lc"]={};n["__lc"] = o;var r=t.createElement("script");r.async=!0,r.type="text/javascript",r.src="https://cdn.livechatinc.com/tracking.js",t.head.appendChild(r)})(window,document,window.__lc||{});
      `;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-4xl font-bold mb-4">Live Chat</h1>
      <p className="text-lg text-gray-700 mb-8">A support agent will be with you shortly.</p>
      <div className="p-6 bg-white rounded shadow-md">
        <p className="text-gray-500">The LiveChat widget should appear in the corner.</p>
      </div>
    </div>
  );
} 