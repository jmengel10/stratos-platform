'use client';

import { useState } from 'react';

export default function BasicClickTest() {
  const [clickCount, setClickCount] = useState(0);
  const [messages, setMessages] = useState<string[]>([]);

  const addMessage = (message: string) => {
    setMessages(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const handleClick = () => {
    addMessage('Button clicked!');
    setClickCount(prev => prev + 1);
    console.log('Basic button clicked!');
  };

  const handleNativeClick = () => {
    addMessage('Native HTML button clicked!');
    console.log('Native HTML button clicked!');
    alert('Native HTML button works!');
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Basic Click Test</h1>
      
      <div className="bg-white border border-gray-300 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">React Button Test</h2>
        <button
          onClick={handleClick}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          React Button (Clicked {clickCount} times)
        </button>
      </div>

      <div className="bg-white border border-gray-300 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Native HTML Button Test</h2>
        <button
          onClick={handleNativeClick}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Native HTML Button
        </button>
      </div>

      <div className="bg-white border border-gray-300 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Direct JavaScript Test</h2>
        <button
          id="js-test-button"
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          JavaScript Button
        </button>
        <script dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener('DOMContentLoaded', function() {
              const button = document.getElementById('js-test-button');
              if (button) {
                button.addEventListener('click', function() {
                  console.log('Direct JavaScript click handler fired!');
                  alert('Direct JavaScript works!');
                });
              }
            });
          `
        }} />
      </div>

      <div className="bg-gray-100 border border-gray-300 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Click Messages</h2>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {messages.length === 0 ? (
            <p className="text-gray-500">No clicks registered yet. Try clicking the buttons above.</p>
          ) : (
            messages.map((message, index) => (
              <div key={index} className="text-sm font-mono bg-white p-2 rounded border">
                {message}
              </div>
            ))
          )}
        </div>
        <button
          onClick={() => setMessages([])}
          className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
        >
          Clear Messages
        </button>
      </div>
    </div>
  );
}
