import React, { useEffect, useRef, useState } from "react";
import {
  FileIcon,
  MoreVertical,
  Music4Icon,
  ImageIcon,
  FileTextIcon,
  VideoIcon,
  Archive,
  Trash2Icon,
  Undo2Icon,
} from "lucide-react";
import { FaFilePdf } from "react-icons/fa";
import { toast } from "react-toastify";
import { ACCESS_TOKEN_KEY, USER_KEY } from "@/constants";

interface FileCardProps {
  id: number;
  name: string;
  size?: number;
  fileUrl?: string;
  refreshData: () => Promise<void>;
}

const DeleteFileCard: React.FC<FileCardProps> = ({
  id,
  name,
  size,
  fileUrl,
  refreshData,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [loadingStates, setLoadingStates] = useState({
    delete: false,
  });

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatFileSize = (bytes: number | null): string => {
    if (!bytes) return "Unknown size";
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const extension = name.toLowerCase().split(".").pop();

  const user = localStorage.getItem(USER_KEY);
  const userId = user ? JSON.parse(user).id : 0;

  const getFileIcon = () => {
    const extension = name.toLowerCase().split(".").pop();
    switch (extension) {
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "webp":
        return <ImageIcon className="w-12 h-12 text-blue-500" />;
      case "mp3":
      case "wav":
      case "ogg":
        return <Music4Icon className="w-12 h-12 text-purple-500" />;
      case "mp4":
      case "mov":
      case "avi":
        return <VideoIcon className="w-12 h-12 text-red-500" />;
      case "zip":
      case "rar":
      case "7z":
        return <Archive className="w-12 h-12 text-yellow-500" />;
      case "txt":
        return <FileTextIcon className="w-12 h-12 text-green-500" />;
      case "doc":
        return <FileTextIcon className="w-12 h-12 text-green-500" />;
      case "docx":
        return <FileTextIcon className="w-12 h-12 text-green-500" />;
      case "pdf":
        return <FaFilePdf className="w-12 h-12 text-red-500" />;
      default:
        return <FileIcon className="w-12 h-12 text-gray-500" />;
    }
  };

  const isImage = name.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleDeleteFile = async () => {
    try {
      setLoadingStates((prev) => ({ ...prev, delete: true }));
      const token = localStorage.getItem(ACCESS_TOKEN_KEY);
      const formData = {
        userId,
      };

      const response = await fetch(
        `https://parkteletech-storage-backend.onrender.com/api/v1/files/hard/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete file");
      }
      setIsDeleteModalOpen(false);
      await refreshData();
      toast.success("File deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete file, Try again after some time");
      console.error("Error deleting file:", error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, delete: false }));
    }
  };

  const handleRestoreFile = async () => {
    try {
      const token = localStorage.getItem(ACCESS_TOKEN_KEY);
      const formData = {
        userId: userId,
      };

      const response = await fetch(
        `https://parkteletech-storage-backend.onrender.com/api/v1/files/restore/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to restore file");
      }
      setIsDeleteModalOpen(false);
      await refreshData();
      toast.success("File restored successfully!");
    } catch (error) {
      toast.error("Failed to restore file");
      console.error("Error restoring file:", error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, delete: false }));
    }
  };

  return (
    <div className="w-36 lg:w-60 relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 group">
      <div className="w-full aspect-square rounded-lg p-2">
        {isImage ? (
          <img
            src={fileUrl}
            alt={name}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 rounded-lg">
            {getFileIcon()}
            {extension?.toUpperCase()}
          </div>
        )}

        {/* Overlay with details - visible on hover for md+ screens, always visible on small screens */}
        <div className="absolute inset-0 rounded-lg bg-black bg-opacity-60 p-3 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 shadow-md">
          {/* Top options button */}
          <div className="absolute top-3 right-3">
            <button
              ref={buttonRef}
              onClick={toggleDropdown}
              className="p-1.5 bg-white bg-opacity-40 hover:bg-opacity-100 rounded-full transition-colors"
              aria-label="More options"
            >
              <MoreVertical className="w-4 h-4 text-gray-700" />
            </button>

            {isDropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10 border border-gray-200"
              >
                <ul className="py-1">
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-red-600 flex items-center gap-2"
                    onClick={() => setIsDeleteModalOpen(true)}
                  >
                    <Trash2Icon className="w-4 h-4" />
                    Delete
                  </li>
                  <li
                    className="px-4 py-2 flex gap-2 hover:bg-gray-100 cursor-pointer text-sm text-green-600"
                    onClick={handleRestoreFile}
                  >
                    <Undo2Icon className="w-4 h-4" />
                    Restore
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Bottom file details */}
          <div className="absolute bottom-3 left-3 right-3 text-white">
            <p className="font-medium text-sm truncate" title={name}>
              {name}
            </p>
            <p className="text-xs opacity-90 mt-0.5">
              {formatFileSize(size as number)}
            </p>
          </div>
        </div>
      </div>

      {isDeleteModalOpen && (
        <DeleteModal
          fileName={name}
          isLoading={loadingStates.delete}
          onClose={() => setIsDeleteModalOpen(false)}
          onDelete={handleDeleteFile}
        />
      )}
    </div>
  );
};

interface DeleteModalProps {
  fileName: string;
  isLoading: boolean;
  onClose: () => void;
  onDelete: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  fileName,
  isLoading,
  onClose,
  onDelete,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-lg font-semibold mb-2">Delete File</h2>
        <p className="mb-4 text-gray-600">
          Are you sure you want to Delete{" "}
          <span className="font-medium">{fileName}</span>? This action cannot be
          undone.
        </p>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50"
            onClick={onDelete}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteFileCard;
