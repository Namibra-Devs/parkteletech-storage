import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import FolderButton from "./newFolder-button";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

export function FolderModal() {
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost">
            <FolderButton />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Folder</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Folder Name
              </Label>
              <Input id="name" className="lg:col-span-3 col-span-2" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-blue-600 text-white">
              Create Folder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
