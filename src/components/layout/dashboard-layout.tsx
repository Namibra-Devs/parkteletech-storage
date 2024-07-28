import { useState } from "react";
import Sidebar from "../shared/sidebar";
import Header from "../shared/header";
import MobileSidebar from "../shared/mobile-sidebar";
import { MenuIcon } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <MobileSidebar
        className=""
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <Sidebar />
      <div className="flex w-0 flex-1 flex-col overflow-hidden border-l-[1px] border-slate-300">
        <div className="flex items-center gap-2 border-b-[1px] border-slate-300">
          <div className="z-10 relative flex h-20 flex-shrink-0 md:hidden">
            <button
              className="pl-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 xl:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <MenuIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="flex-1">
            <Header />
          </div>
        </div>
        <main className="relative h-full w-full flex-1 overflow-y-auto  bg-purple-50 focus:outline-none md:mx-0 md:my-0 md:mr-4 ">
          {children}
        </main>
      </div>
    </div>
  );
}
