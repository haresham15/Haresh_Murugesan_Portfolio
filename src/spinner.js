import React from 'react';

const Spinner = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-[#070B12]">
      <div className="relative w-20 h-20 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#F3EFE7]/15 border-t-[#FF6B35] rounded-full animate-spin" />
      </div>
    </div>
  );
};

export default Spinner;
