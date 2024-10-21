import { useParams, Link } from "react-router-dom";
import FileUpload from "@/components/shared/fileUpload-button";
import FolderCard from "@/components/shared/folder-card";
import GridComponent from "@/components/shared/grid";
import ListComponent from "@/components/shared/list";
import { useCallback, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import FileCard from "@/components/shared/file-card";
import { ACCESS_TOKEN_KEY } from "@/constants";
import { FolderModal } from "@/components/shared/folder-modal";
import { useApi } from "@/hooks/context/GlobalContext";

interface File {
  id: number;
  originalFileName: string;
  size: string;
  type: string;
  url: string;
  secureUrl: string;
  publicID: string;
  resourceType: string;
  format: string;
  userId: string;
  folderId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

interface Folder {
  id: number;
  name: string;
  parentFolderId: number | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  files: File[];
  childFolder: Folder[];
}

const FolderView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const folderId = id ? parseInt(id) : 0;
  const [folderData, setFolderData] = useState<Folder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<
    { id: number; name: string }[]
  >([]);

  const {
    refreshFileData,
    refreshFolderData,
    refreshTrashFiles,
    refreshTrashFolders,
  } = useApi();

  const fetchFolderData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem(ACCESS_TOKEN_KEY);

      if (folderId === 0) {
        // Handle root folder case
        setFolderData({
          id: 0,
          name: "Root",
          parentFolderId: null,
          userId: "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          deletedAt: null,
          files: [],
          childFolder: [],
        });
      } else {
        const response = await fetch(
          `https://storage-api.parkteletechafrica.com/api/v1/folders/${folderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch folder data");
        }

        const data = await response.json();
        setFolderData(data.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [folderId]);

  useEffect(() => {
    fetchFolderData();
  }, [fetchFolderData]);

  useEffect(() => {
    if (folderData) {
      const buildBreadcrumbs = async (currentFolder: Folder) => {
        const breadcrumbsArray = [
          { id: currentFolder.id, name: currentFolder.name },
        ];

        let parentId = currentFolder.parentFolderId;
        while (parentId) {
          try {
            const token = localStorage.getItem(ACCESS_TOKEN_KEY);
            const response = await fetch(
              `https://storage-api.parkteletechafrica.com/api/v1/folders/${parentId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (!response.ok) throw new Error("Failed to fetch parent folder");

            const parentFolder = await response.json();
            breadcrumbsArray.unshift({
              id: parentFolder.data.id,
              name: parentFolder.data.name,
            });
            parentId = parentFolder.data.parentFolderId;
          } catch (error) {
            console.error("Error fetching parent folder:", error);
            break;
          }
        }

        setBreadcrumbs(breadcrumbsArray);
      };

      if (folderId !== 0) {
        buildBreadcrumbs(folderData);
      } else {
        setBreadcrumbs([]);
      }
    }
  }, [folderData, folderId]);

  console.log("Folder Data:", folderData);

  if (loading) {
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
            onClick={fetchFolderData}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 w-full min-h-screen bg-gray-50">
      <ToastContainer position="top-center" />

      {/* Header Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {folderData?.name || "My Files"}
          </h1>

          <div className="flex items-center gap-3">
            <ListComponent />
            <div className="hidden lg:block">
              <GridComponent />
            </div>
            <FileUpload folderId={folderId} refreshFileData={fetchFolderData} />
            <FolderModal
              parentFolderId={folderId}
              refreshFolderData={fetchFolderData}
            />
          </div>
        </div>

        {/* Breadcrumbs */}
        <nav className="flex text-sm">
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            Home
          </Link>
          {breadcrumbs.map((crumb, index) => (
            <span key={index} className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              {index === breadcrumbs.length - 1 ? (
                <span className="text-gray-600 font-medium">{crumb.name}</span>
              ) : (
                <Link
                  to={`/folder/${crumb.id}`}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  {crumb.name}
                </Link>
              )}
            </span>
          ))}
        </nav>
      </div>

      {/* Folders Section */}
      <div className="">
        <h2 className="text-lg mt-5 font-semibold text-gray-700 mb-4">
          Folders
        </h2>
        {folderData?.childFolder && folderData.childFolder.length > 0 ? (
          <div className="mb-8">
            <div className="flex flex-col gap-2 lg:grid lg:grid-cols-3 lg:gap-4 my-4">
              {folderData.childFolder.map((folder) => (
                <FolderCard
                  key={folder.id}
                  id={folder.id}
                  name={folder.name}
                  lastModified={folder.updatedAt}
                  totalSize={folder.files?.reduce(
                    (acc, file) => acc + parseInt(file.size),
                    0
                  )}
                  fileCount={folder.files?.length || 0}
                  refreshFolderData={refreshFolderData}
                  refreshTrashFolders={refreshTrashFolders}
                  refreshParentFolderData={fetchFolderData}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg p-8 mb-8 text-center">
            <p className="text-gray-500 mb-4">No folders found</p>
            <span className="text-4xl lg:text-6xl">📁</span>
          </div>
        )}
      </div>

      {/* Files Section */}
      <div>
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Files</h2>
        {folderData?.files && folderData.files.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 items-center place-items-center">
            {folderData.files.map((file) => (
              <FileCard
                key={file.id}
                id={file.id}
                name={file.originalFileName}
                fileUrl={file.secureUrl}
                size={parseInt(file.size)}
                refreshFileData={refreshFileData}
                refreshTrashFiles={refreshTrashFiles}
                refreshParentFolderData={fetchFolderData}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg p-8 text-center">
            <p className="text-gray-500 mb-4">No files found</p>
            <span className="text-4xl lg:text-6xl">📄</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FolderView;
