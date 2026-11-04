import React from 'react';

const Spinner = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-[#050505]">
      <div className="relative w-20 h-20 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-white/20 border-t-[#7DD3FC] rounded-full animate-spin" />
      </div>
    </div>
  );
};

export default Spinner;
