// "use client";

// import React from "react";
// import Sidebar from "./Sidebar";
// import { useSidebarToggle } from "@/hooks/useSidebarToggle";
// import { cn } from "@/lib/utils";
// import { useStore } from "@/hooks/useStore";

// export default function DefaultLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const sidebar = useStore(useSidebarToggle, (state) => state);

//   if (!sidebar) return null;

//   // const [collapsed, setCollapsed] = useState<boolean>(true);
//   // const {
//   //   token: { colorBgContainer, borderRadiusLG },
//   // } = theme.useToken();

//   // // Dynamically change the margin when the Sider is collapsed
//   // const marginLeftValue = collapsed ? 70 : 170; // 80px for collapsed Sider, 200px for expanded

//   return (
//     <>
//       <Sidebar />
//       <main
//         className={cn(
//           "min-h-[calc(100vh)] bg-zinc-50 dark:bg-zinc-900 transition-[margin-left] ease-in-out duration-300",
//           sidebar?.isOpen === false ? "lg:ml-[90px]" : "lg:ml-72"
//         )}
//       >
//         {children}
//       </main>
//     </>
//   );
// }
