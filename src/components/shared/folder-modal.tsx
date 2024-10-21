import { useState } from "react";
import { useApi } from "@/hooks/context/GlobalContext";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import FolderButton from "./newFolder-button";
import { Button } from "../ui/button";
import { ACCESS_TOKEN_KEY } from "@/constants";

export function FolderModal({
  parentFolderId,
  refreshFolderData,
}: {
  parentFolderId?: number;
  refreshFolderData?: () => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { refreshData } = useApi();

  const token = localStorage.getItem(ACCESS_TOKEN_KEY);

  const formData = {
    name,
    parentFolderId: parentFolderId ? parentFolderId : null,
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(
        `https://storage-api.parkteletechafrica.com/api/v1/folders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create folder");
      }

      setName("");
      setIsOpen(false);
      toast.success("Folder created successfully");
      await refreshData();
      if (refreshFolderData) {
        await refreshFolderData();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to create folder");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <FolderButton />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Folder</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="bg-white p-6 rounded-md w-full max-w-md">
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter folder name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="bg-blue-600 text-white"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Folder"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
