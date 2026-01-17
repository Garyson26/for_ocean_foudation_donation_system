import React from 'react';

function TailwindTest() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-2xl p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Tailwind CSS is Working! 🎉
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          If you can see this styled correctly, Tailwind CSS is properly configured.
        </p>

        <div className="space-y-4">
          <div className="p-4 bg-blue-100 border-l-4 border-blue-500 rounded">
            <p className="text-blue-700 font-semibold">Primary Color Test</p>
          </div>

          <div className="p-4 bg-green-100 border-l-4 border-green-500 rounded">
            <p className="text-green-700 font-semibold">Success Color Test</p>
          </div>

          <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500 rounded">
            <p className="text-yellow-700 font-semibold">Warning Color Test</p>
          </div>

          <div className="p-4 bg-red-100 border-l-4 border-red-500 rounded">
            <p className="text-red-700 font-semibold">Danger Color Test</p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300">
            Button 1
          </button>
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300">
            Button 2
          </button>
          <button className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-300">
            Button 3
          </button>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Responsive Grid</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="h-20 bg-gradient-to-br from-pink-400 to-red-500 rounded-lg shadow"></div>
            <div className="h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg shadow"></div>
            <div className="h-20 bg-gradient-to-br from-green-400 to-cyan-500 rounded-lg shadow"></div>
            <div className="h-20 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg shadow"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TailwindTest;

