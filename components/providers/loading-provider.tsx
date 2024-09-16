"use client";

import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { cn } from "@/lib/utils";
import { LoaderFullpage } from "../loader-fullpage";
import { useSession } from "next-auth/react";
import { DateRange } from "react-day-picker";
import { Role } from "@prisma/client";

interface LoadingProps {
  setLoadingApp: Dispatch<SetStateAction<boolean | undefined>>;
  loadingApp: boolean | undefined;
  userRole: Role | undefined;
  dateFilter: DateRange | undefined;
  setDateFilter: Dispatch<SetStateAction<DateRange | undefined>>;
  cityFilter: string | undefined;
  setCityFilter: Dispatch<SetStateAction<string | undefined>>;
  companyFilter: string | undefined;
  setCompanyFilter: Dispatch<SetStateAction<string | undefined>>;
  // levelFilter: RiskLevel | undefined | null;
  // setLevelFilter: Dispatch<SetStateAction<RiskLevel | undefined | null>>;
}

interface Props {
  children: ReactNode;
}

export const LoadingContext = createContext<LoadingProps>({
  // loading
  setLoadingApp: () => {},
  loadingApp: false,
  // role user
  userRole: undefined,
  //   date picker
  dateFilter: undefined,
  setDateFilter: (date) => {},
  //   company id
  companyFilter: undefined,
  setCompanyFilter: (date) => {},
  //   Level
  // levelFilter: undefined,
  // setLevelFilter: (date) => {},
  //   city id
  cityFilter: undefined,
  setCityFilter: (cityId) => {},
});

export const LoadingProvider = ({ children }: Props) => {
  const [loadingApp, setLoadingApp] = useState<boolean | undefined>(true);
  const [dateFilter, setDateFilter] = useState<DateRange | undefined>(
    undefined
  );
  const [cityFilter, setCityFilter] = useState<string | undefined>(undefined);
  //   const [levelFilter, setLevelFilter] = useState<RiskLevel | undefined | null>(
  //     undefined
  //   );
  const [companyFilter, setCompanyFilter] = useState<string | undefined>(
    undefined
  );
  const [userRole, setUserRole] = useState<Role | undefined>();

  const { data: session, status, update } = useSession();
  // useEffect(() => {
  //   const interval = setInterval(() => update(), 1000 * 60 * 60);
  //   return () => clearInterval(interval);
  // }, [update]);

  useEffect(() => {
    async function fetchUserAndCompany() {
      if (status === "authenticated") {
        setUserRole(session.user.role as Role);
      }
    }

    if (status !== "loading" && status !== "unauthenticated") {
      fetchUserAndCompany();
    }
  }, [status]);

  useEffect(() => {
    try {
      setLoadingApp(false);
    } catch (error) {
      setLoadingApp(false);
    } finally {
      setLoadingApp(false);
    }
  }, []);


  return (
    <LoadingContext.Provider
      value={{
        setLoadingApp,
        loadingApp,
        userRole,
        dateFilter,
        setDateFilter,
        setCityFilter,
        cityFilter,
        companyFilter,
        setCompanyFilter,
        // levelFilter,
        // setLevelFilter,
      }}
    >
      <body
        className={cn(loadingApp && "overflow-hidden")}
        id="layout-main"
        style={{
          background: `url('/tisog-bg-blue-white.png')`,
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundPosition: 0 ,
          height: "100vh",
          overflow: loadingApp ? "hidden" : "auto",
          width: "100%",
          minWidth: "100%",
        }}
        
      >
        <div className="fadeIn w-full">
          {children}
          {loadingApp && <LoaderFullpage />}
        </div>
      </body>
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);
