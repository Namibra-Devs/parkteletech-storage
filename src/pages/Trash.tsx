import FolderCard from "@/components/shared/folder-card";
import ImageCard from "@/components/shared/image-card";
import { InfoIcon, Trash2Icon } from "lucide-react";

const Trash = () => {
  const folders = [1, 2, 3, 4];
  const files = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  return (
    <div className="p-4 w-full h-full">
      <div className="w-full lg:relative">
        <div className="flex items-center gap-5 lg:absolute lg:right-0">
          <div className="flex items-center gap-1">
            <InfoIcon />
            <p className="text-[12px]">
              Items in trash will be deleted ater 30 days
            </p>
          </div>
          <div className="flex items-center gap-1 border border-gray-300 p-2 text-center rounded-xl">
            <Trash2Icon />
            <p className="text-[12px]">Empty Trash</p>
          </div>
        </div>
      </div>

      <div className="lg:mt-10 mt-4">
        <p className="font-semibold">Trash</p>
      </div>

      <div className="my-4">
        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-4 lg:gap-4">
          {folders.map((folder) => (
            <FolderCard key={folder} />
          ))}
        </div>
      </div>
      <div className="">
        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-4 lg:gap-4">
          {files.map((file) => (
            <ImageCard key={file} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Trash;
