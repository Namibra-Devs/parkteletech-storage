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

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FileUpload from "@/components/shared/fileUpload-button";
import FolderCard from "@/components/shared/folder-card";
import GridComponent from "@/components/shared/grid";
import ListComponent from "@/components/shared/list";
import FolderButton from "@/components/shared/newFolder-button";
import { FileIcon, Music4Icon } from "lucide-react";
import { useApi } from "@/hooks/context/GlobalContext";

type FolderProps = {
  id: number;
  name: string;
  user_id: number;
  parent_id: number | null;
  fileCount: number | null;
};

type FileProps = {
  id: number;
  name: string;
  size: number | null;
  user_id: number;
  folder_id: number | null;
};

const FolderView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { folders, files, refreshFolderData, refreshFileData } = useApi();
  const [currentFolders, setCurrentFolders] = useState<FolderProps[]>([]);
  const [currentFiles, setCurrentFiles] = useState<FileProps[]>([]);

  useEffect(() => {
    refreshFolderData();
    refreshFileData();
  }, [refreshFolderData, refreshFileData]);

  useEffect(() => {
    setCurrentFolders(
      folders.filter((folder) => folder.parent_id === Number(id))
    );
    setCurrentFiles(files.filter((file) => file.folder_id === Number(id)));
  }, [folders, files, id]);

  const handleRename = async (folderId: number, newName: string) => {
    // Implement rename logic here
    console.log(`Renaming folder ${folderId} to ${newName}`);
    // After renaming, call refreshFolderData()
    await refreshFolderData();
  };

  const handleDelete = async (folderId: number) => {
    // Implement delete logic here
    console.log(`Deleting folder ${folderId}`);
    // After deleting, call refreshFolderData()
    await refreshFolderData();
  };

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
      <div className="mt-10">
        <p className="font-semibold">Folder {id}</p>
      </div>
      <div className="flex flex-col gap-2 lg:grid lg:grid-cols-4 lg:gap-4 my-4">
        {currentFolders.map((folder) => (
          <FolderCard
            key={folder.id}
            folder={folder}
            fileCount={folder.fileCount || 0}
            onRename={handleRename}
            onDelete={handleDelete}
          />
        ))}
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
