import { type ClassValue, clsx } from "clsx"
import { format, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { twMerge } from "tailwind-merge"
import { differenceInDays } from 'date-fns';


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function capitalizeFirstLetter(string: string): string {
  const words = string.split(" ");

  const capitalize = words.map((word) => {
    return word[0].toUpperCase() + word.substring(1);
  }).join(" ");

  return capitalize
}


export const formatDate = (date: Date): string => {
  return format(date, "dd 'de' MMMM 'de' yyyy", { locale: es });
};

export const formatDateCert = (date: Date) => {
  let formattedDate = format(date, "'día' dd' de' MMMM 'de' yyyy", {
    locale: es,
  });

  if (date.getDate() === 1) {
    formattedDate = formattedDate.replace("días", "día");
  }
  return formattedDate;
};

export const normalizeString = (str: string) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}



export const shouldControlBeManaged = (createdDate: string) => {
  const now = new Date();
  const created = new Date(createdDate);
  return differenceInDays(now, created) < 7;
};

export const shouldControlBeManagedSameDay = (createdDate: Date | null) => {
  if(!createdDate) return false
  const now = new Date();
  return isSameDay(now, createdDate);
};