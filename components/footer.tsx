import React from "react";

export const Footer = () => {
  return (
    <footer className="footer h-10 w-full bg-blue-900 flex items-center z-30 md:ps-[95px] mt-3">
      <div className="w-full mx-auto flex justify-center gap-1 text-white text-sm md:ps-[95px]">
        <span>2024</span>
        <p className="text-sm">&copy; Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};
