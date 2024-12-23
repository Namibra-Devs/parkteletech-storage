import { ACCESS_TOKEN_KEY } from "@/constants";
import {
  FolderIcon,
  MoreVertical,
  Loader2,
  Trash2Icon,
  Undo2Icon,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";

interface FolderCardProps {
  id: number;
  name: string;
  fileCount: number;
  lastModified?: string;
  totalSize?: number;
  refreshFolderData: () => Promise<void>;
  refreshTrashFolders: () => Promise<void>;
}

const DeleteFolderCard: React.FC<FolderCardProps> = ({
  id,
  name,
  fileCount,
  lastModified,
  totalSize,
  refreshFolderData,
  refreshTrashFolders,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return "0 B";
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
    setIsDropdownOpen(false);
  };

  const handleDeleteFolder = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(
        `https://parkteletech-storage-backend-gzba.onrender.com/api/v1/folders/hard-delete/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete folder");
      }
      setIsDeleteModalOpen(false);
      toast.success("Folder deleted successfully!");
      await refreshFolderData();
      await refreshTrashFolders();
    } catch (error) {
      toast.error("Failed to delete folder");
      console.error("Error deleting folder:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRestoreFolder = async () => {
    setIsRestoring(true);
    setIsDropdownOpen(false);
    try {
      const response = await fetch(
        `https://parkteletech-storage-backend-gzba.onrender.com/api/v1/folders/restore/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to restore folder");
      }
      await refreshFolderData();
      await refreshTrashFolders();
      toast.success("Folder restored successfully!");
    } catch (error) {
      toast.error("Failed to restore folder");
      console.error("Error restoring folder:", error);
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <div className="h-auto min-h-[60px] w-full flex flex-col bg-white rounded-md shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center p-3">
        <div className="bg-slate-100 h-10 w-10 flex items-center justify-center rounded-md">
          <FolderIcon className="fill-orange-300 text-orange-300" />
        </div>
        <div className="flex-1 ml-3">
          <div className="hover:text-blue-600">
            <p className="font-semibold text-sm truncate">{name}</p>
            <div className="flex gap-2 md:gap-2 text-gray-500">
              <span>
                {fileCount} {fileCount === 1 ? "file" : "files"}
              </span>
              <span>·</span>
              <span>{formatFileSize(totalSize)}</span>
              <span>·</span>
              <span>{formatDate(lastModified)}</span>
            </div>
          </div>
        </div>
        <div className="relative ml-2" ref={dropdownRef}>
          <button
          title="More"
            onClick={toggleDropdown}
            className="p-1 hover:bg-gray-100 rounded-full"
            disabled={isRestoring}
          >
            <MoreVertical className="h-5 w-5 text-gray-500" />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10 border border-gray-200">
              <ul className="py-1">
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm flex items-center gap-2"
                  onClick={handleRestoreFolder}
                >
                  <Undo2Icon className="h-4 w-4" />
                  {isRestoring ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Restoring...
                    </>
                  ) : (
                    "Restore"
                  )}
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 gap-2 flex cursor-pointer text-sm text-red-600"
                  onClick={openDeleteModal}
                >
                  <Trash2Icon className="h-4 w-4" />
                  Delete
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
      {isDeleteModalOpen && (
        <DeleteModal
          onClose={() => setIsDeleteModalOpen(false)}
          onDelete={handleDeleteFolder}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
};

interface DeleteModalProps {
  onClose: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  onClose,
  onDelete,
  isDeleting,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div ref={modalRef} className="bg-white p-6 rounded-md w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Delete Folder</h2>
        <p className="mb-4 text-gray-600">
          Are you sure you want to delete this folder? This action cannot be
          undone.
        </p>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50 flex items-center gap-2"
            onClick={onDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteFolderCard;
