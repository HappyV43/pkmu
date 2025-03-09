import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { cookies } from "next/headers";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar/AppSidebar";
import { getCurrentSession } from "./actions/auth.actions";
import { redirect } from "next/navigation";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "PKMU",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";
  // const dataUser = await getCurrentSession();
  // if (!dataUser?.session || !dataUser?.user) {
  //   redirect("/auth/login");
  // }

  return (
    <html lang="en" className="light">
      <head>
        <link
          rel="icon"
          href="/icon?<generated>"
          type="image/<generated>"
          sizes="<generated>"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* <ThemeProvider attribute="class" defaultTheme="system" enableSystem> */}
        <SidebarProvider defaultOpen={defaultOpen}>
          <AppSidebar />
          <main className="w-full">
            <SidebarTrigger className="h-20 w-20" />
            {children}
          </main>
        </SidebarProvider>
        <Toaster />
        {/* </ThemeProvider> */}
      </body>
    </html>
  );
}
