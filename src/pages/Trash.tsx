import DeleteFileCard from "@/components/shared/delete-fileCard";
import DeleteFolderCard from "@/components/shared/delete-folderCard";
import { useApi } from "@/hooks/context/GlobalContext";
import { ToastContainer } from "react-toastify";

const Trash = () => {
  const { trashFolders, refreshTrashFolderData, trashFolderMessage, trashFiles, refreshTrashFileData, trashFileMessage } = useApi();
  return (
    <div className="w-full p-4 flex-col">
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

        <div className="w-full">
        <p className="font-semibold">Trash Files</p>
        <div className="flex flex-col gap-2 lg:grid lg:grid-cols-3 lg:gap-4 my-4">
          {trashFileMessage !== "No trashed files found." ? (
            trashFiles.map((file) => (
              <div className="" key={file.id}>
                <DeleteFileCard
                  id={file.id}
                  name={file.name}
                  size={file.size}
                  refreshTrashFileData={refreshTrashFileData}
                  refreshFileData={refreshTrashFileData}
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
      </div>
  );
};

export default Trash;
