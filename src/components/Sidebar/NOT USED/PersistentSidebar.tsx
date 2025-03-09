// "use client";

// import { useEffect, useState } from "react";
// import { SidebarProvider } from "@/components/ui/sidebar";
// import { cookies } from "next/headers";

// const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7

// export function PersistentSidebarProvider({ defaultOpen, children }: { defaultOpen: boolean; children: React.ReactNode }) {
//   const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);

//   useEffect(() => {
//     document.cookie = `sidebar:state=${isOpen ? "true" : "false"}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
//   }, [isOpen]);

//   return (
//     <SidebarProvider defaultOpen={isOpen} onToggle={(open) => setIsOpen(open)}>
//       {children}
//     </SidebarProvider>
//   );
// }
