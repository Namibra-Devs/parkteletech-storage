import FileUpload from "@/components/shared/fileUpload-button";
import FolderCard from "@/components/shared/folder-card";
import { FolderModal } from "@/components/shared/folder-modal";
import GridComponent from "@/components/shared/grid";
import ListComponent from "@/components/shared/list";

const DashboardPage = () => {
  const pinnedList = [1, 2, 3];
  const allFolders = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  // const folder = {
  //   id: 1,
  //   name: "Folder1",
  //   fileCount: 5,
  // };

  // const handleRenameFolder = (id: number, newName: string) => {
  //   console.log("Rename folder:", id, newName);
  // };

  // const handleDeleteFolder = (id: number) => {
  //   console.log("Delete folder:", id);
  // };

  return (
    <div className="p-4 w-full h-full">
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
        {pinnedList.map((item) => (
          <div className="" key={item}>
            <FolderCard
            // folder={folder}
            // onRename={handleRenameFolder}
            // onDelete={handleDeleteFolder}
            />
          </div>
        ))}
      </div>
      <div className="">
        <p className="font-semibold">All Folders</p>
        <div className="flex flex-col gap-2 lg:grid lg:grid-cols-3 lg:gap-4 my-4">
          {allFolders.map((item) => (
            <div className="" key={item}>
              <FolderCard
              // folder={folder}
              // onRename={handleRenameFolder}
              // onDelete={handleDeleteFolder}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

// import { useEffect, useState } from "react";
// import { useApi } from "@/hooks/context/GlobalContext";
// import FileUpload from "@/components/shared/fileUpload-button";
// import FolderCard from "@/components/shared/folder-card";
// import { FolderModal } from "@/components/shared/folder-modal";
// import GridComponent from "@/components/shared/grid";
// import ListComponent from "@/components/shared/list";

// interface Folder {
//   id: number;
//   name: string;
//   user_id: number;
//   parent_id: number | null;
//   created_at: string;
//   updated_at: string;
//   // fileCount: number; // You might need to add this to your API response
// }

// const DashboardPage = () => {
//   const api = useApi();
//   const [pinnedFolders, setPinnedFolders] = useState<Folder[]>([]);
//   const [allFolders, setAllFolders] = useState<Folder[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchFolders = async () => {
//       try {
//         setIsLoading(true);
//         const folders = await api.listFolders();
//         setAllFolders(folders);

//         const pinned = allFolders.slice(0, 5); // Get the first 5 folders
//         setPinnedFolders(pinned);
//       } catch (error) {
//         console.error("Failed to fetch folders:", error);
//         // You might want to show an error message to the user here
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchFolders();
//   }, [allFolders, api]);

//   const handleRenameFolder = async (id: number, newName: string) => {
//     try {
//       await api.renameFolder(id, newName);
//       // Update the folder in the state
//       const updateFolders = (folders: Folder[]) =>
//         folders.map((folder) =>
//           folder.id === id ? { ...folder, name: newName } : folder
//         );
//       setAllFolders(updateFolders);
//       setPinnedFolders(updateFolders);
//     } catch (error) {
//       console.error("Failed to rename folder:", error);
//       // You might want to show an error message to the user here
//     }
//   };

//   const handleDeleteFolder = async (id: number) => {
//     try {
//       await api.deleteFolder(id);
//       // Remove the folder from the state
//       const filterFolders = (folders: Folder[]) =>
//         folders.filter((folder) => folder.id !== id);
//       setAllFolders(filterFolders);
//       setPinnedFolders(filterFolders);
//     } catch (error) {
//       console.error("Failed to delete folder:", error);
//       // You might want to show an error message to the user here
//     }
//   };

//   if (isLoading) {
//     return <div>Loading...</div>; // Or a more sophisticated loading component
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
//           <FolderModal />
//         </div>
//       </div>
//       <div className="mt-10">
//         <p className="font-semibold">Pinned Folders</p>
//       </div>
//       <div className="flex flex-col gap-2 lg:grid lg:grid-cols-3 lg:gap-4 my-4">
//         {pinnedFolders.map((folder) => (
//           <FolderCard
//             key={folder.id}
//             folder={folder}
//             onRename={handleRenameFolder}
//             onDelete={handleDeleteFolder}
//           />
//         ))}
//       </div>
//       <div className="">
//         <p className="font-semibold">All Folders</p>
//         <div className="flex flex-col gap-2 lg:grid lg:grid-cols-3 lg:gap-4 my-4">
//           {allFolders.map((folder) => (
//             <FolderCard
//               key={folder.id}
//               folder={folder}
//               onRename={handleRenameFolder}
//               onDelete={handleDeleteFolder}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardPage;

// import { useEffect, useState } from "react";
// import { useApi } from "@/hooks/context/GlobalContext";
// import FileUpload from "@/components/shared/fileUpload-button";
// import FolderCard from "@/components/shared/folder-card";
// import { FolderModal } from "@/components/shared/folder-modal";
// import GridComponent from "@/components/shared/grid";
// import ListComponent from "@/components/shared/list";

// interface Folder {
//   id: number;
//   name: string;
//   user_id: number;
//   parent_id: number | null;
//   created_at: string;
//   updated_at: string;
// }

// const DashboardPage = () => {
//   const api = useApi();
//   const [pinnedFolders, setPinnedFolders] = useState<Folder[]>([]);
//   const [allFolders, setAllFolders] = useState<Folder[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<unknown>(null);

//   useEffect(() => {
//     const fetchFolders = async () => {
//       try {
//         setIsLoading(true);
//         setError(null);
//         const folders = await api.listFolders();

//         if (Array.isArray(folders)) {
//           setAllFolders(folders);
//           const pinned = folders.slice(0, 5); // Get the first 5 folders as pinned
//           setPinnedFolders(pinned);
//         } else {
//           throw new Error();
//         }
//       } catch (error) {
//         console.error(error);
//         setError(error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchFolders();
//   }, [api]);

//   const handleRenameFolder = async (id: number, newName: string) => {
//     try {
//       await api.renameFolder(id, newName);
//       const updateFolders = (folders: Folder[]) =>
//         folders.map((folder) =>
//           folder.id === id ? { ...folder, name: newName } : folder
//         );
//       setAllFolders(updateFolders);
//       setPinnedFolders((prev) => updateFolders(prev));
//     } catch (error) {
//       console.error("Failed to rename folder:", error);
//       setError("Failed to rename folder. Please try again.");
//     }
//   };

//   const handleDeleteFolder = async (id: number) => {
//     try {
//       await api.deleteFolder(id);
//       const filterFolders = (folders: Folder[]) =>
//         folders.filter((folder) => folder.id !== id);
//       setAllFolders(filterFolders);
//       setPinnedFolders((prev) => filterFolders(prev));
//     } catch (error) {
//       console.error("Failed to delete folder:", error);
//       setError("Failed to delete folder. Please try again.");
//     }
//   };

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>Error: {String(error)}</div>;
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
//           <FolderModal />
//         </div>
//       </div>
//       <div className="mt-10">
//         <p className="font-semibold">Pinned Folders</p>
//       </div>
//       <div className="flex flex-col gap-2 lg:grid lg:grid-cols-3 lg:gap-4 my-4">
//         {pinnedFolders.map((folder) => (
//           <FolderCard
//             key={folder.id}
//             folder={folder}
//             onRename={handleRenameFolder}
//             onDelete={handleDeleteFolder}
//           />
//         ))}
//       </div>
//       <div className="">
//         <p className="font-semibold">All Folders</p>
//         <div className="flex flex-col gap-2 lg:grid lg:grid-cols-3 lg:gap-4 my-4">
//           {allFolders.map((folder) => (
//             <FolderCard
//               key={folder.id}
//               folder={folder}
//               onRename={handleRenameFolder}
//               onDelete={handleDeleteFolder}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardPage;
