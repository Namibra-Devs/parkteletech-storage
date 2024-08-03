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
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

export function FolderModal() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { refreshFolderData } = useApi();

  const formData = {
    name,
    user_id: localStorage.getItem("userId"),
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(
        "https://www.parkteletechafrica.com/api/folders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create folder");
      }

      if (refreshFolderData) {
        await refreshFolderData();
      }
      setName("");
      setIsOpen(false);
      toast.success("Folder created successfully");
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
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Folder Name
              </Label>
              <Input
                id="name"
                name="name"
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="lg:col-span-3 col-span-2"
              />
            </div>
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
