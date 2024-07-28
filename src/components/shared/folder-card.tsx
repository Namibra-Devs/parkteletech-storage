import { EllipsisVertical, FolderIcon } from "lucide-react";
const FolderCard = () => {
  return (
    <div className="h-[40px] w-full items-center flex bg-white rounded-sm">
      <div className="bg-slate-100 h-full w-10 flex items-center justify-center">
        <FolderIcon className="fill-orange-300 text-orange-300" />
      </div>
      <div className="flex-1 flex p-2 items-center">
        <div className="flex-1">
          <p className="font-semibold text-[12px]">Folder 1</p>
          <p className="text-gray-600 text-[8px]">16 files</p>
        </div>
        <EllipsisVertical className="text-gray-500" />
      </div>
    </div>
  );
};

export default FolderCard;
