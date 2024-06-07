import { Loader2 } from "lucide-react";
import React from "react";

export const LoaderFullpage = () => {
  return (
    <div
      style={{ zIndex: 100, position: "fixed" }}
      className="backdrop-blur-sm bg-white/30 absolute top-0 left-0 w-full min-h-screen max-h-max overflow-hidden z-50 bg-white flex justify-center items-center"
    >
      <Loader2 className="w-16 h-16 animate-spin text-red-600" />
    </div>
  );
};
