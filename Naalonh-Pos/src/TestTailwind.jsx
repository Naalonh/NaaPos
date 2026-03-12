import React from "react";

const TestTailwind = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-10 rounded-lg shadow-lg space-y-6">
        <h1 className="text-2xl font-bold text-center">
          Tailwind Spacing Test
        </h1>

        {/* Padding Test */}
        <div className="bg-red-500 text-white p-4 border-4 border-black">
          p-4 padding test (should have space inside)
        </div>

        {/* Large Padding */}
        <div className="bg-blue-500 text-white p-10 border-4 border-black">
          p-10 padding test (large spacing)
        </div>

        {/* Margin Test */}
        <div className="bg-green-500 text-white p-4 m-10 border-4 border-black">
          m-10 margin test (space outside)
        </div>

        {/* Gap Test */}
        <div className="flex gap-6">
          <div className="bg-purple-500 text-white p-6">Item 1</div>
          <div className="bg-purple-500 text-white p-6">Item 2</div>
          <div className="bg-purple-500 text-white p-6">Item 3</div>
        </div>
      </div>
    </div>
  );
};

export default TestTailwind;
