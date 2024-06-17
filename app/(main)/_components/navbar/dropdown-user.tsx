"use client";

import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModalLogout } from "@/components/modal-logout";

export function DropdownUser({ name, isAdmin }: { name?: string; isAdmin: boolean}) {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="35"
          height="35"
          viewBox="0 0 24 24"
        >
          <path
            fill="#fff"
            fillRule="evenodd"
            d="M3.464 3.464C2 4.93 2 7.286 2 12c0 4.714 0 7.071 1.464 8.535C4.93 22 7.286 22 12 22c4.714 0 7.071 0 8.535-1.465C22 19.072 22 16.714 22 12s0-7.071-1.465-8.536C19.072 2 16.714 2 12 2S4.929 2 3.464 3.464M12 13a1 1 0 1 0 0-2a1 1 0 0 0 0 2m-3-1a1 1 0 1 1-2 0a1 1 0 0 1 2 0m7 1a1 1 0 1 0 0-2a1 1 0 0 0 0 2"
            clipRule="evenodd"
          />
        </svg>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-fit max-w-[150px]">
        <DropdownMenuLabel className="text-center font-bold text-base uppercase p-0  text-primary">
          {name}
        </DropdownMenuLabel>

        <DropdownMenuItem
          className="cursor-pointer border-none hover:bg-secondary hover:text-white"
          onClick={() => router.push(`/${isAdmin ? "admin" : "analista"}/perfil/`)}
        >
          Perfil
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <ModalLogout />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
