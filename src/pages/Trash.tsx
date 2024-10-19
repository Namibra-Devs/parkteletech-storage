import DeleteFileCard from "@/components/shared/delete-fileCard";
import DeleteFolderCard from "@/components/shared/delete-folderCard";
import { useApi } from "@/hooks/context/GlobalContext";
import { ToastContainer } from "react-toastify";

const Trash = () => {
  const { trashFiles, trashFolders, refreshData, isLoading } = useApi();
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
  return (
    <div className="w-full p-4 flex-col">
      <div className="w-full">
        <ToastContainer position="top-center" />
        <div className="">
          <h1 className="text-2xl font-bold">Trash</h1>

          {trashFolders && trashFolders.length > 0 ? (
            <div className="flex flex-col gap-2 lg:grid lg:grid-cols-3 lg:gap-4 my-4">
              {processedFolders.map((folder) => (
                <div key={folder.id}>
                  <DeleteFolderCard
                    id={folder.id as number}
                    name={folder.name as string}
                    fileCount={folder.fileCount as number}
                    totalSize={folder.totalSize as number}
                    refreshData={refreshData}
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
                    refreshData={refreshData}
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
