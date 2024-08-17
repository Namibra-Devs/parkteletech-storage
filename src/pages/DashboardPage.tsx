// import FileUpload from "@/components/shared/fileUpload-button";
// import FolderCard from "@/components/shared/folder-card";
// import { FolderModal } from "@/components/shared/folder-modal";
// import GridComponent from "@/components/shared/grid";
// import ListComponent from "@/components/shared/list";
// import { useApi } from "@/hooks/context/GlobalContext";
// import { toast, ToastContainer } from "react-toastify";

// const DashboardPage = () => {
//   const { folders, refreshFolderData } = useApi();
//   const homeFolders = folders.filter((folder) => folder.parent_id === null);
//   const pinnedFolders = homeFolders.slice(0, 3);

//   const handleRenameFolder = async (id: number, newName: string) => {
//     await fetch(`https://www.parkteletechafrica.com/api/folders/${id}/rename`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ name: newName }),
//     });
//     await refreshFolderData();
//     toast.success("Folder renamed successfully!");
//     console.log("Rename folder:", id, newName);
//   };

//   const handleDeleteFolder = async (id: number) => {
//     await fetch(`https://www.parkteletechafrica.com/api/folders/${id}`, {
//       method: "DELETE",
//     });
//     await refreshFolderData();
//     toast.success("Folder deleted successfully!");
//     console.log("Delete folder:", id);
//   };

//   return (
//     <div className="p-4 w-full h-full">
//       <ToastContainer position="top-center" />
//       <div className="w-full relative">
//         <div className="flex gap-4 items-center right-0 absolute">
//           <ListComponent />
//           <div className="hidden lg:block">
//             <GridComponent />
//           </div>
//           <FileUpload />
//           <FolderModal />
//         </div>
//       </div>
//       <div className="mt-10">
//         <p className="font-semibold">Pinned Folders</p>
//       </div>
//       <div className="flex flex-col gap-2 lg:grid lg:grid-cols-3 lg:gap-4 my-4">
//         {pinnedFolders ? (
//           pinnedFolders.map((folder) => (
//             <div className="" key={folder.id}>
//               <FolderCard
//                 folder={folder}
//                 onDelete={handleDeleteFolder}
//                 onRename={handleRenameFolder}
//                 fileCount={0}
//               />
//             </div>
//           ))
//         ) : (
//           <div className="text-center">No pinned folders</div>
//         )}
//       </div>
//       <div className="">
//         <p className="font-semibold">All Folders</p>
//         <div className="flex flex-col gap-2 lg:grid lg:grid-cols-3 lg:gap-4 my-4">
//           {homeFolders ? (
//             homeFolders.map((folder) => (
//               <div className="" key={folder.id}>
//                 <FolderCard
//                   folder={folder}
//                   onDelete={handleDeleteFolder}
//                   onRename={handleRenameFolder}
//                   fileCount={0}
//                 />
//               </div>
//             ))
//           ) : (
//             <div className="text-center">
//               No folders found! Create a new folder
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardPage;

import FileUpload from "@/components/shared/fileUpload-button";
import FolderCard from "@/components/shared/folder-card";
import { FolderModal } from "@/components/shared/folder-modal";
import GridComponent from "@/components/shared/grid";
import ListComponent from "@/components/shared/list";
import { useApi } from "@/hooks/context/GlobalContext";
import { FileIcon, Music4Icon } from "lucide-react";
import { ToastContainer } from "react-toastify";

const DashboardPage = () => {
  const { folders, refreshFolderData, refreshTrashFolderData, files } = useApi();
  const homeFolders = folders.filter((folder) => folder.parent_id === null);
  const pinnedFolders = homeFolders.slice(0, 3);

  return (
    <div className="p-4 w-full h-full">
      <ToastContainer position="top-center" />
      <div className="w-full relative">
        <div className="flex gap-4 items-center right-0 absolute">
          <ListComponent />
          <div className="hidden lg:block">
            <GridComponent />
          </div>
          <FileUpload />
          <FolderModal />
        </div>
      </div>
      <div className="mt-10">
        <p className="font-semibold">Pinned Folders</p>
      </div>
      <div className="flex flex-col gap-2 lg:grid lg:grid-cols-3 lg:gap-4 my-4">
        {pinnedFolders.length > 0 ? (
          pinnedFolders.map((folder) => (
            <div className="" key={folder.id}>
              <FolderCard
                id={folder.id}
                name={folder.name}
                fileCount={0}
                refreshFolderData={refreshFolderData}
                refreshTrashFolderData={refreshTrashFolderData}
              />
            </div>
          ))
        ) : (
          <div className="text-center">No pinned folders</div>
        )}
      </div>
      <div className="">
        <p className="font-semibold">All Folders</p>
        <div className="flex flex-col gap-2 lg:grid lg:grid-cols-3 lg:gap-4 my-4">
          {homeFolders.length > 0 ? (
            homeFolders.map((folder) => (
              <div className="" key={folder.id}>
                <FolderCard
                  id={folder.id}
                  name={folder.name}
                  fileCount={0}
                  refreshFolderData={refreshFolderData}
                  refreshTrashFolderData={refreshTrashFolderData}
                />
              </div>
            ))
          ) : (
            <div className="text-center">
              No folders found! Create a new folder
            </div>
          )}
        </div>
      </div>

      <div className="">
        <div className="">
          <p className="font-semibold">All Files</p>
        </div>
        <div className="grid grid-cols-2 lg:grid lg:grid-cols-4 gap-4 items-center">
         {files.length > 0 ? (files.map((file) => (
          <div key={file.id} className="flex flex-col">
            <div className="w-40 h-40 bg-gray-300 rounded-sm">
              {file.name.endsWith(".png") || file.name.endsWith(".jpg") ? (
                <img
                  src={`https://www.parkteletechafrica.com/api/files/${file.id}`}
                  alt={file.name}
                  className="rounded-sm object-cover w-full h-full"
                />
              ) : (
                <i className="flex justify-center mt-16">
                  {file.name.endsWith(".mp3") ? <Music4Icon /> : <FileIcon />}
                </i>
              )}
            </div>
            <div className="mt-2">
              <p className="text-sm font-semibold">{file.name}</p>
              <p className="text-xs font-medium text-gray-400">
                {file.size ? `${file.size} bytes` : "Unknown size"}
              </p>
            </div>
          </div>
        ))) : (
          <div className="text-center">No files found! Upload a file</div>
        )}
      </div>
      </div>
    </div>
  );
};

export default DashboardPage;
