import UserNav from "./user-nav";
import { Input } from "../ui/input";
import { BellIcon, Search } from "lucide-react";

export default function Header() {
  return (
    <div className="flex flex-1 items-center justify-between bg-white px-4 sm:pt-4 h-16">
      <div className="flex flex-1 items-center justify-between bg-white">
        <div className="flex items-center">
          <Search className="border-none outline-none h-4 w-4" />
          <Input
            type="search"
            placeholder="Search"
            className="border-none outline-none focus-visible:ring-transparent"
          />
        </div>
        <BellIcon className="h-4 w-4" />
      </div>
      <div className="ml-4 flex items-center md:ml-6">
        <UserNav />
      </div>
    </div>
  );
}
