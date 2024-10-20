import DashboardNav from "./dashboard-nav";
import { Sheet, SheetContent } from "../ui/sheet";
import { navItems } from "@/constants";
import { Dispatch, SetStateAction } from "react";
import { Link } from "react-router-dom";
import StorageUsage from "./storage-ui";
import { CustomFile, useApi } from "@/hooks/context/GlobalContext";

type TMobileSidebarProps = {
  className: string;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
  sidebarOpen: boolean;
};

export default function MobileSidebar({
  setSidebarOpen,
  sidebarOpen,
}: TMobileSidebarProps) {
  const { files } = useApi();
  return (
    <>
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="bg-background !px-0 w-[270px]">
          <div className="space-y-4">
            <div className="space-y-4 px-3 py-2">
              <Link to="/" className="px-2 py-2 text-2xl font-bold text-white">
                Logo
              </Link>
              <div className="space-y-1 px-2">
                <DashboardNav items={navItems} />
              </div>
            </div>

            <div className="absolute bottom-4 w-full items-center justify-center">
              <div className="items-center justify-center place-items-center left-2">
                <StorageUsage files={files as CustomFile[]} />
              </div>
              <p className="text-xs text-center text-gray-500 mt-2">
                &copy; {new Date().getFullYear()} Park Teletech
              </p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
