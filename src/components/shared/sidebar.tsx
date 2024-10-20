import DashboardNav from "@/components/shared/dashboard-nav";
import { navItems } from "@/constants";
import { useApi, CustomFile } from "@/hooks/context/GlobalContext";
import { useSidebar } from "@/hooks/use-sidebar";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import StorageUsage from "./storage-ui";

type SidebarProps = {
  className?: string;
};

export default function Sidebar({ className }: SidebarProps) {
  const { isMinimized, toggle } = useSidebar();
  const [status, setStatus] = useState(false);

  const { files } = useApi();

  const handleToggle = () => {
    setStatus(true);
    toggle();
    setTimeout(() => setStatus(false), 500);
  };
  return (
    <nav
      className={cn(
        `relative z-10 hidden h-screen flex-none  px-3 md:block`,
        status && "duration-500",
        !isMinimized ? "w-72" : "w-[85px]",
        className
      )}
    >
      <div
        className={cn(
          "flex items-center px-0 py-5 md:px-2",
          isMinimized ? "justify-center " : "justify-between"
        )}
      >
        {!isMinimized && (
          <h1 className="text-2xl font-bold text-blue-600 text-center">
            Park Teletech Storage
          </h1>
        )}
        <ChevronLeft
          className={cn(
            "size-8 cursor-pointer rounded-full border bg-background text-foreground",
            isMinimized && "rotate-180"
          )}
          onClick={handleToggle}
        />
      </div>
      <div className="space-y-4 py-4">
        <div className="px-2 py-2">
          <div className="mt-3 space-y-1">
            <DashboardNav items={navItems} />
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 w-full">
        <StorageUsage files={files as CustomFile[]} isMinimized={isMinimized} />
        <p
          className={cn(
            "text-xs text-center text-gray-500 mt-2",
            isMinimized && "hidden"
          )}
        >
          &copy; {new Date().getFullYear()} Park Teletech
        </p>
      </div>
    </nav>
  );
}
