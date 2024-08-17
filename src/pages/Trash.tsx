import DeleteFolderCard from "@/components/shared/delete-folderCard";
import { useApi } from "@/hooks/context/GlobalContext";
import { ToastContainer } from "react-toastify";

const Trash = () => {
  const { trashFolders, refreshTrashFolderData, trashFolderMessage } = useApi();
  return (
    <div className="w-full">
      <ToastContainer position="top-center" />
        <p className="font-semibold">Trash Folders</p>
        <div className="flex flex-col gap-2 lg:grid lg:grid-cols-3 lg:gap-4 my-4">
          {trashFolderMessage !== "No trashed folders found." ? (
            trashFolders.map((folder) => (
              <div className="" key={folder.id}>
                <DeleteFolderCard
                  id={folder.id}
                  name={folder.name}
                  fileCount={0}
                  refreshTrashFolderData={refreshTrashFolderData}
                />
              </div>
            ))
          ) : (
            <div className="text-center w-full justify-center flex">
              Trash is empty
            </div>
          )}
        </div>
      </div>
  );
};

export default Trash;
