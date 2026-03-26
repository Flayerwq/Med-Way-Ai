// "use client";

// import { useToast } from "@/hooks/use-toast";
// import React, { createContext, useContext, useRef } from "react";

// type LogoutTimerContextType = {
//   startLogoutTimer: (logoutFn: () => void, delayInMinutes?: number) => void;
//   clearLogoutTimer: () => void;
// };

// const LogoutTimerContext = createContext<LogoutTimerContextType | undefined>(
//   undefined
// );

// export const LogoutTimerProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

//   const startLogoutTimer = (logoutFn: () => void, delayInMinutes = 55) => {
//     const { toast } = useToast()
//     clearLogoutTimer(); // Clear any existing timer
//     const toastWarningDelay = delayInMinutes - 2 * 60 * 1000;
//     timerRef.current = setTimeout(() => {
//       console.log("⚠️ You will be logged out in 2 minutes!");
//       toast({
//         title: "Session expire. You gonna logout in 2 min, please save your info and login again.",
//       });
//     }, toastWarningDelay);

//     timerRef.current = setTimeout(() => {
//       console.log("🔔 Logging out after 3 minutes...");
//       logoutFn();
//     }, delayInMinutes * 60 * 1000); // Convert to ms
//   };

//   const clearLogoutTimer = () => {
//     if (timerRef.current) {
//       clearTimeout(timerRef.current);
//       timerRef.current = null;
//     }
//   };

//   return (
//     <LogoutTimerContext.Provider value={{ startLogoutTimer, clearLogoutTimer }}>
//       {children}
//     </LogoutTimerContext.Provider>
//   );
// };

// export const useLogoutTimer = (): LogoutTimerContextType => {
//   const context = useContext(LogoutTimerContext);
//   if (!context) {
//     throw new Error("useLogoutTimer must be used within a LogoutTimerProvider");
//   }
//   return context;
// };
