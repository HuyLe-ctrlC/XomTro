import React from "react";
import { AiOutlineReload } from "react-icons/ai";

export const Reload = () => {
  const handleReload = () => {
    window.location.reload(false);
  };
  return (
    <button onClick={() => handleReload()}>
      <AiOutlineReload className="ml-3 w-7 h-7 bg-green-600 rounded-full text-white" />
    </button>
  );
};
