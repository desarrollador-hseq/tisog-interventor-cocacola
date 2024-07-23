"use client";

import {
  AlertDialog,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ConfirmModalProps {
  children: ReactNode;
  title: ReactNode;
  textBtn?: ReactNode;
  btnClass?: string;
  btnDisabled?: boolean;
  large?: boolean;
  onAcept?: () => void | Promise<void> | undefined;
  onClose?: () => void | undefined;
  btnAsChild?: boolean;
  close?: boolean;
  openDefault?: boolean;
}

export const SimpleModal = ({
  children,
  title,
  textBtn,
  btnClass,
  btnDisabled,
  onAcept,
  onClose,
  large = true,
  btnAsChild,
  close,
  openDefault
}: ConfirmModalProps) => {
  const [open, setOpen] = useState(openDefault);
  const [wasClosed, setWasClosed] = useState(close);

  const handleClose = () => {
    setOpen(false);
    onClose && onClose();
  };

  useEffect(() => {
    setWasClosed(close);
  }, [close]);
  useEffect(() => {
    setOpen(openDefault);
  }, [openDefault]);

  useEffect(() => {
    console.log({ wasClosed });
    if (wasClosed) {
      setOpen(false);
    }
  }, [wasClosed]);

  const onClickAcept = () => {
    setOpen(false);
    onAcept && onAcept();
    onClose && onClose();
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          asChild={btnAsChild}
          disabled={btnDisabled}
          className={cn("bg-primary", btnClass)}
        >
          {textBtn}
        </Button>
        {/* ) : (
          textBtn
        )} */}
      </AlertDialogTrigger>

      <AlertDialogContent
        className={`overflow-y-auto pt-0 px-0 ${
          large ? "max-w-screen-lg min-h-[300px]" : "max-w-[600px]"
        }  max-h-screen `}
      >
        <AlertDialogHeader className="">
          <AlertDialogTitle className="text-xl  bg-slate-200  p-3 text-primary">
            <div className="flex justify-between ">
              {title}
              <Button
                className="w-fit h-fit flex rounded-md justify-center items-center p-0.5 hover:bg-slate-50"
                variant="outline"
                onClick={handleClose}
              >
                <X className="text-red-500" />
              </Button>
            </div>
          </AlertDialogTitle>
        </AlertDialogHeader>
        <div className="w-full px-3 pt-3">{children}</div>

        <AlertDialogFooter className="gap-3 border-slate-500 flex flex-row items-center h-full px-3">
          {onAcept && (
            <Button
              className="bg-zinc-400 hover:bg-zinc-600"
              onClick={handleClose}
            >
              Cancelar
            </Button>
          )}
          {onAcept && <Button onClick={onClickAcept}>Aceptar</Button>}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
