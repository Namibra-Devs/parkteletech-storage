// import FileUpload from "@/components/shared/fileUpload-button";
// import FolderCard from "@/components/shared/folder-card";
// import GridComponent from "@/components/shared/grid";
// import ListComponent from "@/components/shared/list";
// import FolderButton from "@/components/shared/newFolder-button";
// import { FileIcon, Music4Icon } from "lucide-react";
// import { useApi } from "@/hooks/context/GlobalContext";

// const FolderView = () => {
//   const { folders } = useApi();
//   return (
//     <div className="p-4 w-full h-full">
//       <div className="w-full relative">
//         <div className="flex gap-4 items-center right-0 absolute">
//           <ListComponent />
//           <div className="hidden lg:block">
//             <GridComponent />
//           </div>
//           <FileUpload />
//           <FolderButton />
//         </div>
//       </div>
//       <div className="mt-10">
//         <p className="font-semibold">Folder 1</p>
//       </div>
//       <div className="flex flex-col gap-2 lg:grid lg:grid-cols-4 lg:gap-4 my-4">
//         {folderList.map((item) => (
//           <FolderCard key={item} />
//         ))}
//       </div>
//       <div className="grid grid-cols-2 lg:grid lg:grid-cols-4 gap-4 items-center">
//         {fileData.map((item) => (
//           <div className="flex flex-col">
//             <div className="w-40 h-40 bg-gray-300 rounded-sm">
//               {item.type === "png" || item.type === "jpg" ? (
//                 <img
//                   src={item.img.toString()}
//                   alt={item.name}
//                   className="rounded-sm object-cover w-full h-full"
//                 />
//               ) : (
//                 <i className="flex justify-center mt-16">{item.img}</i>
//               )}
//             </div>
//             <div className="mt-2">
//               <p className="text-sm font-semibold">{`${item.name}.${item.type}`}</p>
//               <p className="text-xs font-medium text-gray-400">{item.size}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default FolderView;

// const fileData = [
//   {
//     id: 1,
//     name: "file1",
//     size: "2.5mb",
//     type: "png",
//     img: "https://images.pexels.com/photos/547114/pexels-photo-547114.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
//   },
//   {
//     id: 2,
//     name: "file2",
//     size: "1.5mb",
//     type: "mp3",
//     img: <Music4Icon />,
//   },
//   {
//     id: 3,
//     name: "file3",
//     size: "3.5mb",
//     type: "pdf",
//     img: <FileIcon />,
//   },
//   {
//     id: 4,
//     name: "file4",
//     size: "2.5mb",
//     type: "doc",
//     img: <FileIcon />,
//   },
//   {
//     id: 5,
//     name: "file5",
//     size: "2.5mb",
//     type: "jpg",
//     img: "https://images.pexels.com/photos/1005417/pexels-photo-1005417.jpeg?auto=compress&cs=tinysrgb&w=600",
//   },
//   {
//     id: 6,
//     name: "file6",
//     size: "2.5mb",
//     type: "mp3",
//     img: <Music4Icon />,
//   },
//   {
//     id: 7,
//     name: "file7",
//     size: "2.5mb",
//     type: "pdf",
//     img: <FileIcon />,
//   },
//   {
//     id: 8,
//     name: "file8",
//     size: "2.5mb",
//     type: "png",
//     img: "https://images.pexels.com/photos/289586/pexels-photo-289586.jpeg?auto=compress&cs=tinysrgb&w=600",
//   },
//   {
//     id: 9,
//     name: "file9",
//     size: "2.5mb",
//     type: "mp3",
//     img: <Music4Icon />,
//   },
//   {
//     id: 10,
//     name: "file10",
//     size: "2.5mb",
//     type: "doc",
//     img: <FileIcon />,
//   },
//   {
//     id: 11,
//     name: "file11",
//     size: "2.5mb",
//     type: "pdf",
//     img: <FileIcon />,
//   },
//   {
//     id: 12,
//     name: "file12",
//     size: "2.5mb",
//     type: "pdf",
//     img: <FileIcon />,
//   },
// ];

import { useParams, Link } from "react-router-dom";
import FileUpload from "@/components/shared/fileUpload-button";
import FolderCard from "@/components/shared/folder-card";
import GridComponent from "@/components/shared/grid";
import ListComponent from "@/components/shared/list";
import FolderButton from "@/components/shared/newFolder-button";
import { FileIcon, Music4Icon } from "lucide-react";
import { useApi } from "@/hooks/context/GlobalContext";
import { useEffect, useState } from "react";

const FolderView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const folderId = id ? parseInt(id) : 0; // Use 0 for root folder
  const { folders, files, refreshFolderData, refreshFileData } = useApi();
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

  const handleRename = async (folderId: number, newName: string) => {
    console.log(`Renaming folder ${folderId} to ${newName}`);
    await refreshFolderData();
  };

  const handleDelete = async (folderId: number) => {
    console.log(`Deleting folder ${folderId}`);
    await refreshFolderData();
  };

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
      <div className="w-full relative">
        <div className="flex gap-4 items-center right-0 absolute">
          <ListComponent />
          <div className="hidden lg:block">
            <GridComponent />
          </div>
          <FileUpload />
          <FolderButton />
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
              folder={folder}
              fileCount={folder.fileCount || 0}
              onRename={handleRename}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <div className="text-gray-400 text-center col-span-4 flex flex-col">
            <p className="">No folders found! Create One</p>
            <span className="text-9xl mt-10">😥</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid lg:grid-cols-4 gap-4 items-center">
        {currentFiles.map((file) => (
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
        ))}
      </div>
    </div>
  );
};

export default FolderView;
