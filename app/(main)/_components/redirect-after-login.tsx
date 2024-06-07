"use client";

import { redirect, usePathname } from "next/navigation";

export const RedirectAfterLogin = () => {
  const path = usePathname();
  return redirect(!!path ? `/?redirect=${path}` : "/");
};
