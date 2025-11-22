import React from "react";

function Card({ title, count, icon }) {
  return (
    <div
      className="
        bg-white
        rounded-xl
        shadow-md
        hover:shadow-xl
        transform hover:-translate-y-1
        transition-all duration-300 ease-in-out
        p-12 sm:p-12
        w-full
        min-h-[180px]
        flex
        items-center
      "
    >
      <div className="flex items-center justify-between h-[19vh] w-full gap-6">
        
        {/* Left Section (Text) */}
        <div className="flex-1">
          <div className="text-4xl font-bold text-blue-900 mb-2">
            {count}
          </div>
          <h3 className="text-2xl font-semibold text-grey-900">
            {title}
          </h3>
        </div>

        {/* Right Section (Icon) */}
        <div className="w-40 h-90 flex-shrink-0">
          <img
            src={icon}
            alt={title}
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}

export default Card;
