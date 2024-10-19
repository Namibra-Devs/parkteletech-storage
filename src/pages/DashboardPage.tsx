import { ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";

import FileCard from "@/components/shared/file-card";
import FileUpload from "@/components/shared/fileUpload-button";
import FolderCard from "@/components/shared/folder-card";
import { FolderModal } from "@/components/shared/folder-modal";
import GridComponent from "@/components/shared/grid";
import ListComponent from "@/components/shared/list";
import { useApi } from "@/hooks/context/GlobalContext";
import { PinIcon } from "lucide-react";

export interface Folder {
  id?: number;
  name?: string;
  fileCount?: number;
  userId?: number;
  parentFolderId?: number;
  isPinned?: boolean;
  files?: File[];
  childFolders?: Folder[];
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: null;
  totalSize?: number;
}

export interface File {
  id?: number;
  originalFileName?: string;
  size?: number;
  type?: string;
  url?: string;
  secureUrl?: string;
  publicId?: string;
  userId?: number;
  folderId?: number | null;
  resourceType?: string;
  format?: string;
  createdAt?: string;
  updatedAt?: string;
}

const DashboardPage = () => {
  const { folders, files, refreshData, isLoading, error } = useApi();
  const [homeFolders, setHomeFolders] = useState<Folder[]>([]);
  const [homeFiles, setHomeFiles] = useState<File[]>([]);
  const [pinnedFolders, setPinnedFolders] = useState<Folder[]>([]);

  console.log({
    folders,
    files,
    homeFolders,
    homeFiles,
    pinnedFolders,
  });

  useEffect(() => {
    // Process files that don't belong to any folder
    const processedFiles = files.filter((file) => !file.folderId);
    setHomeFiles(processedFiles);

    // Process folders with their actual file counts and additional information
    const processedFolders = folders.map((folder) => ({
      ...folder,
      fileCount: folder.files?.length || 0,
      totalSize:
        folder.files?.reduce(
          (acc, file) => acc + (Number(file.size) || 0),
          0
        ) || 0,
    }));

    const rootFolders = processedFolders.filter(
      (folder) => folder.parentFolderId === null
    );
    setHomeFolders(rootFolders);

    // Set pinned folders (you might want to add a "pinned" property to your folder data)
    // For now, we'll just take the 3 most recently updated folders
    const sortedFolders = [...processedFolders].sort(
      (a, b) =>
        new Date(b.updatedAt || 0).getTime() -
        new Date(a.updatedAt || 0).getTime()
    );
    setPinnedFolders(sortedFolders.filter((folder) => folder.isPinned));
  }, [folders, files]);

  // Add debug renders
  console.log("Current homeFiles state:", homeFiles);

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
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="p-4 mb-8 scroll-mb-4 w-full h-full">
      <ToastContainer position="top-center" />

      {/* Header Controls */}
      <div className="w-full relative">
        <div className="flex gap-4 items-center right-0 absolute">
          <ListComponent />
          <div className="hidden lg:block">
            <GridComponent />
          </div>
          <FileUpload folderId={null} refreshFileData={refreshData} />
          <FolderModal />
        </div>
      </div>

      {/* Pinned Folders Section */}
      <div className="mt-10">
        <p className="font-semibold">
          Pinned <PinIcon className="h-4 w-4" fill="red" />
        </p>
      </div>
      <div className="w-full">
        {pinnedFolders.length > 0 ? (
          <div className="flex flex-col gap-2 lg:grid lg:grid-cols-3 lg:gap-2 my-4">
            {pinnedFolders.map((folder: Folder) => (
              <div key={folder.id}>
                <FolderCard
                  id={folder.id ?? 0}
                  name={folder.name || ""}
                  fileCount={folder.fileCount || 0}
                  lastModified={folder.updatedAt}
                  totalSize={folder.totalSize}
                  refreshData={refreshData}
                  isHome={true}
                  isPinned={folder.isPinned}
                />
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {/* All Folders Section */}
      <div className="mt-3">
        <p className="font-semibold">All Folders</p>
        <div className="w-full">
          {homeFolders.length > 0 ? (
            <div className="flex flex-col gap-2 lg:grid lg:grid-cols-3 lg:gap-4 my-4">
              {homeFolders.map((folder: Folder) => (
                <div key={folder.id}>
                  <FolderCard
                    id={folder.id ?? 0}
                    name={folder.name || ""}
                    fileCount={folder.fileCount || 0}
                    lastModified={folder.updatedAt}
                    totalSize={folder.totalSize}
                    refreshData={refreshData}
                    isPinned={folder.isPinned}
                    isHome={true}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg p-8 mb-8 text-center w-full">
              <p className="text-gray-500 mb-4">No folders found</p>
              <span className="text-4xl lg:text-6xl">📁</span>
            </div>
          )}
        </div>
      </div>

      {/* All Files Section */}
      <div className="w-full">
        <div>
          <p className="font-semibold">All Files</p>
          {/* <p className="text-sm text-gray-500">
            Total files: {homeFiles.length}
          </p>{" "} */}
          {/* Debug count */}
        </div>
        <div className="w-full">
          {homeFiles && homeFiles.length > 0 ? (
            <div className="grid grid-cols-2 place-items-center md:place-items-start lg:grid-cols-4 gap-4 items-center w-full my-4">
              {homeFiles.map((file: File) => (
                <FileCard
                  key={file.id}
                  id={file.id ?? 0}
                  name={file.originalFileName || ""}
                  fileUrl={file.url}
                  size={parseInt(file.size?.toString() || "0")}
                  refreshData={refreshData}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg p-8 text-center w-full">
              <p className="text-gray-500 mb-4">No files found</p>
              <span className="text-4xl lg:text-6xl">📄</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
