import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Printer } from "lucide-react";
import { cn } from "@/lib/utils";

export const ButtonPrint = () => {
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(false);

  const handleScroll = () => {
    setPrevScrollPos(window.scrollY);
    if(prevScrollPos < 1000) return
    setVisible(true);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos, visible, handleScroll]);
  const [dataLoaded, setDataLoaded] = useState(false);


  useEffect(() => {
    setTimeout(() => {
      setDataLoaded(true);
    }, 1000);
  }, []);

  const handlePrint = () => {
    if (dataLoaded) {
      window.print();
    } else {
      alert("Los datos aún se están cargando...");
    }
  };
  return (
    <Button
      onClick={handlePrint}
      className={cn("non-print  w-[70px] bottom-1 right-3 shadow-sm rounded-full p-1 px-2.5 bg-blue-800 hover:bg-blue-900 text-white", visible && "fixed")}
    >
      <Printer className="w-5 h-5" />
    </Button>
  );
};
