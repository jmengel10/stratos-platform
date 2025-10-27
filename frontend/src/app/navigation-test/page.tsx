'use client';

import { useState } from 'react';

export default function NavigationTest() {
  const [testResults, setTestResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testDirectNavigation = (path: string) => {
    addResult(`Testing navigation to: ${path}`);
    try {
      if (typeof window !== 'undefined') {
        addResult(`Window object available, attempting navigation...`);
        window.location.href = path;
        addResult(`Navigation command executed successfully`);
      } else {
        addResult(`Window object not available`);
      }
    } catch (error) {
      addResult(`Navigation error: ${error}`);
    }
  };

  const testButtonClick = () => {
    addResult('Button clicked - testing navigation');
    testDirectNavigation('/conversations/new');
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Navigation Test Page</h1>
      
      <div className="bg-white border border-gray-300 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
        <div className="space-y-4">
          <button
            onClick={testButtonClick}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Test Navigation to /conversations/new
          </button>
          
          <button
            onClick={() => testDirectNavigation('/home')}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Test Navigation to /home
          </button>
          
          <button
            onClick={() => testDirectNavigation('/clients')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Test Navigation to /clients
          </button>
        </div>
      </div>

      <div className="bg-gray-100 border border-gray-300 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Test Results</h2>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {testResults.length === 0 ? (
            <p className="text-gray-500">No tests run yet. Click a button above to test navigation.</p>
          ) : (
            testResults.map((result, index) => (
              <div key={index} className="text-sm font-mono bg-white p-2 rounded border">
                {result}
              </div>
            ))
          )}
        </div>
        <button
          onClick={() => setTestResults([])}
          className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
        >
          Clear Results
        </button>
      </div>
    </div>
  );
}
