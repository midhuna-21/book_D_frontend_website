import React from "react";


const Orders: React.FC = () => {

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 space-y-4">
      {/* Rent List Button */}
      <button className="w-48 h-12 text-white font-bold bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-lg hover:shadow-2xl transition duration-300">
    Rent List
</button>


      {/* Lend List Button */}
      <button className="w-48 h-12 text-white font-bold bg-black rounded-lg border border-pink-500 hover:text-pink-500 hover:shadow-pink-500/40 transition duration-300">
    Rent List
</button>

  </div>
    );
};

export default Orders;
