import { Loader2 } from "lucide-react";
import React from "react";

export const LoaderFullpage = () => {
  return (
    <div
      style={{ zIndex: 100, position: "fixed" }}
      className="backdrop-blur-sm bg-blue-500/20 absolute top-0 left-0 pt-3 pl-4 w-full min-h-full max-h-max overflow-hidden z-50 flex justify-center items-center"
    >
      <Loader2 className="w-14 h-14 animate-spin text-[#052e65]" />
    </div>
  );
};
