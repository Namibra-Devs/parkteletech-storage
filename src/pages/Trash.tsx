import DeleteFileCard from "@/components/shared/delete-fileCard";
import DeleteFolderCard from "@/components/shared/delete-folderCard";
import { useApi } from "@/hooks/context/GlobalContext";
import { ToastContainer } from "react-toastify";

const Trash = () => {
  const {
    trashFiles,
    trashFolders,
    refreshFileData,
    refreshFolderData,
    refreshTrashFolders,
    refreshTrashFiles,
    isLoading,
    refreshTrashData,
    error,
  } = useApi();
  console.log({ trashFiles, trashFolders });
  const processedFolders = trashFolders.map((folder) => ({
    ...folder,
    fileCount: folder.files?.length || 0,
    totalSize:
      folder.files?.reduce((acc, file) => acc + (Number(file.size) || 0), 0) ||
      0,
  }));

  console.log({ trashFolders, processedFolders });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">
            Something went wrong, try again after sometime
          </p>
          <button
            onClick={refreshTrashData}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="w-full p-4 flex-col">
      <div className="w-full">
        <ToastContainer position="top-center" />
        <div className="">
          <h1 className="text-2xl font-bold mb-4">Trash</h1>

          {trashFolders && trashFolders.length > 0 ? (
            <div className="flex flex-col gap-2 lg:grid lg:grid-cols-3 lg:gap-4 my-4">
              {processedFolders.map((folder) => (
                <div key={folder.id}>
                  <DeleteFolderCard
                    id={folder.id as number}
                    name={folder.name as string}
                    fileCount={folder.fileCount as number}
                    totalSize={folder.totalSize as number}
                    lastModified={folder.updatedAt as string}
                    refreshFolderData={refreshFolderData}
                    refreshTrashFolders={refreshTrashFolders}
                  />
                </div>
              ))}
            </div>
          ) : null}

          {trashFiles && trashFiles.length > 0 ? (
            <div className="grid grid-cols-2 place-items-center lg:grid-cols-4 gap-4 items-center w-full">
              {trashFiles.map((file) => (
                <div className="" key={file.id}>
                  <DeleteFileCard
                    id={file.id as number}
                    name={file.originalFileName as string}
                    fileUrl={file.url as string}
                    size={file.size as number}
                    refreshFileData={refreshFileData}
                    refreshTrashFiles={refreshTrashFiles}
                  />
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Trash;
