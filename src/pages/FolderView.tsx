// import { useParams, Link } from "react-router-dom";
// import FileUpload from "@/components/shared/fileUpload-button";
// import FolderCard from "@/components/shared/folder-card";
// import GridComponent from "@/components/shared/grid";
// import ListComponent from "@/components/shared/list";
// import { FileIcon, Music4Icon } from "lucide-react";
// import { useApi } from "@/hooks/context/GlobalContext";
// import { useEffect, useState } from "react";
// import { FolderModal } from "@/components/shared/folder-modal";
// import { toast } from "react-toastify";

// const FolderView: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const folderId = id ? parseInt(id) : 0; // Use 0 for root folder
//   const { folders, files, refreshFolderData, refreshFileData } = useApi();
//   const [breadcrumbs, setBreadcrumbs] = useState<
//     { id: number; name: string }[]
//   >([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       await refreshFolderData();
//       await refreshFileData();
//       setLoading(false);
//     };
//     fetchData();
//   }, [refreshFolderData, refreshFileData]);

//   useEffect(() => {
//     if (folders) {
//       const buildBreadcrumbs = (
//         folderId: number
//       ): { id: number; name: string }[] => {
//         const folder = folders.find((f) => f.id === folderId);
//         if (!folder) return [];
//         if (folder.parent_id === 0 || folder.parent_id === null) {
//           return [{ id: folder.id, name: folder.name }];
//         }
//         return [
//           ...buildBreadcrumbs(folder.parent_id),
//           { id: folder.id, name: folder.name },
//         ];
//       };
//       setBreadcrumbs(folderId === 0 ? [] : buildBreadcrumbs(folderId));
//     }
//   }, [folderId, folders]);

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

//   const currentFolders = folders
//     ? folders.filter((folder) => folder.parent_id === folderId)
//     : [];
//   const currentFiles = files
//     ? files.filter((file) => file.folder_id === folderId)
//     : [];

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="p-4 w-full h-full">
//       <div className="w-full relative">
//         <div className="flex gap-4 items-center right-0 absolute">
//           <ListComponent />
//           <div className="hidden lg:block">
//             <GridComponent />
//           </div>
//           <FileUpload />
//           <FolderModal parent_Id={id} />
//         </div>
//       </div>

//       <div className="mt-10 w-full">
//         <div className="mb-4">
//           <Link to="/" className="text-blue-600 hover:underline font-semibold">
//             Home
//           </Link>
//           {breadcrumbs.map((crumb, index) => (
//             <span key={crumb.id}>
//               {" > "}
//               {index === breadcrumbs.length - 1 ? (
//                 <span className="font-semibold">{crumb.name}</span>
//               ) : (
//                 <Link
//                   to={`/folder/${crumb.id}`}
//                   className="text-blue-500 hover:underline"
//                 >
//                   {crumb.name}
//                 </Link>
//               )}
//             </span>
//           ))}
//         </div>
//         <p className="font-bold">
//           {folderId === 0
//             ? "Root Folder"
//             : folders?.find((f) => f.id === folderId)?.name || "Folder"}
//         </p>
//       </div>

//       <div className="flex flex-col gap-2 lg:grid lg:grid-cols-4 lg:gap-4 my-4 w-full">
//         {currentFolders.length > 0 ? (
//           currentFolders.map((folder) => (
//             <FolderCard
//               key={folder.id}
//               folder={folder}
//               fileCount={folder.fileCount || 0}
//               onRename={handleRenameFolder}
//               onDelete={handleDeleteFolder}
//             />
//           ))
//         ) : (
//           <div className="text-gray-400 text-center col-span-4 flex flex-col">
//             <p className="">No folders found! Create One</p>
//             <span className="text-5xl lg:text-9xl mt-10 animate-pulse">😥</span>
//           </div>
//         )}
//       </div>

//       <div className="grid grid-cols-2 lg:grid lg:grid-cols-4 gap-4 items-center">
//         {currentFiles.map((file) => (
//           <div key={file.id} className="flex flex-col">
//             <div className="w-40 h-40 bg-gray-300 rounded-sm">
//               {file.name.endsWith(".png") || file.name.endsWith(".jpg") ? (
//                 <img
//                   src={`https://www.parkteletechafrica.com/api/files/${file.id}`}
//                   alt={file.name}
//                   className="rounded-sm object-cover w-full h-full"
//                 />
//               ) : (
//                 <i className="flex justify-center mt-16">
//                   {file.name.endsWith(".mp3") ? <Music4Icon /> : <FileIcon />}
//                 </i>
//               )}
//             </div>
//             <div className="mt-2">
//               <p className="text-sm font-semibold">{file.name}</p>
//               <p className="text-xs font-medium text-gray-400">
//                 {file.size ? `${file.size} bytes` : "Unknown size"}
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default FolderView;

import { useParams, Link } from "react-router-dom";
import FileUpload from "@/components/shared/fileUpload-button";
import FolderCard from "@/components/shared/folder-card";
import GridComponent from "@/components/shared/grid";
import ListComponent from "@/components/shared/list";
import { useApi } from "@/hooks/context/GlobalContext";
import { useEffect, useState } from "react";
import { FolderModal } from "@/components/shared/folder-modal";
import { ToastContainer } from "react-toastify";
import FileCard from "@/components/shared/file-card";

const FolderView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const folderId = id ? parseInt(id) : 0; // Use 0 for root folder
  const { folders, files, refreshFolderData, refreshFileData, refreshTrashFolderData, refreshTrashFileData } = useApi();
  const [breadcrumbs, setBreadcrumbs] = useState<
    { id: number; name: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await refreshFolderData();
      await refreshFileData();
      setLoading(false);
    };
    fetchData();
  }, [refreshFolderData, refreshFileData]);

  useEffect(() => {
    if (folders) {
      const buildBreadcrumbs = (
        folderId: number
      ): { id: number; name: string }[] => {
        const folder = folders.find((f) => f.id === folderId);
        if (!folder) return [];
        if (folder.parent_id === 0 || folder.parent_id === null) {
          return [{ id: folder.id, name: folder.name }];
        }
        return [
          ...buildBreadcrumbs(folder.parent_id),
          { id: folder.id, name: folder.name },
        ];
      };
      setBreadcrumbs(folderId === 0 ? [] : buildBreadcrumbs(folderId));
    }
  }, [folderId, folders]);

  const currentFolders = folders
    ? folders.filter((folder) => folder.parent_id === folderId)
    : [];
  const currentFiles = files
    ? files.filter((file) => file.folder_id === folderId)
    : [];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 w-full h-full">
      <ToastContainer position="top-center" />
      <div className="w-full relative">
        <div className="flex gap-4 items-center right-0 absolute">
          <ListComponent />
          <div className="hidden lg:block">
            <GridComponent />
          </div>
          <FileUpload
            folderId={folderId}
            refreshFileData={refreshFileData}
          />
          <FolderModal parent_Id={id} />
        </div>
      </div>

      <div className="mt-10 w-full">
        <div className="mb-4">
          <Link to="/" className="text-blue-600 hover:underline font-semibold">
            Home
          </Link>
          {breadcrumbs.map((crumb, index) => (
            <span key={crumb.id}>
              {" > "}
              {index === breadcrumbs.length - 1 ? (
                <span className="font-semibold">{crumb.name}</span>
              ) : (
                <Link
                  to={`/folder/${crumb.id}`}
                  className="text-blue-500 hover:underline"
                >
                  {crumb.name}
                </Link>
              )}
            </span>
          ))}
        </div>
        <p className="font-bold">
          {folderId === 0
            ? "Root Folder"
            : folders?.find((f) => f.id === folderId)?.name || "Folder"}
        </p>
      </div>

      <div className="flex flex-col gap-2 lg:grid lg:grid-cols-4 lg:gap-4 my-4 w-full">
        {currentFolders.length > 0 ? (
          currentFolders.map((folder) => (
            <FolderCard
              key={folder.id}
              id={folder.id}
              name={folder.name}
              fileCount={folder.fileCount || 0}
              refreshFolderData={refreshFolderData}
              refreshTrashFolderData={refreshTrashFolderData}
            />
          ))
        ) : (
          <div className="text-gray-400 text-center col-span-4 flex flex-col">
            <p className="">No folders found! Create One</p>
            <span className="text-5xl lg:text-9xl mt-10 animate-pulse">😥</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid lg:grid-cols-4 gap-4 items-center">
         {currentFiles.length > 0 ? (currentFiles.map((file) => (
          <FileCard
            key={file.id}
            id={file.id}
            name={file.name}
            size={file.size}
            refreshFileData={refreshFileData}
            refreshTrashFileData={refreshTrashFileData}
          />
        ))) : (
          <div className="text-center">No files found! Upload a file</div>
        )}
      </div>
    </div>
  );
};

export default FolderView;
