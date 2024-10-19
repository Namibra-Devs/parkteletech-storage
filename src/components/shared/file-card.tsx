import React, { useState, useRef, useEffect } from "react";
import {
  FileIcon,
  MoreVertical,
  Music4Icon,
  ImageIcon,
  FileTextIcon,
  VideoIcon,
  Archive,
  Edit2Icon,
} from "lucide-react";
import { FaFilePdf } from "react-icons/fa";
import { toast } from "react-toastify";
import { ACCESS_TOKEN_KEY, USER_KEY } from "@/constants";

interface FileCardProps {
  id: number;
  name: string;
  size?: number;
  fileUrl?: string;
  isPinned?: boolean;
  refreshData: () => Promise<void>;
}

const FileCard: React.FC<FileCardProps> = ({
  id,
  name,
  size,
  fileUrl,
  refreshData,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [loadingStates, setLoadingStates] = useState({
    delete: false,
    pin: false,
    rename: false,
  });
  const [newFileName, setNewFileName] = useState(name);

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
  const isImage = name.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/);

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
      case "doc":
      case "docx":
        return <FileTextIcon className="w-12 h-12 text-green-500" />;
      case "pdf":
        return <FaFilePdf className="w-12 h-12 text-red-500" />;
      default:
        return <FileIcon className="w-12 h-12 text-gray-500" />;
    }
  };

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleDeleteFile = async () => {
    try {
      setLoadingStates((prev) => ({ ...prev, delete: true }));
      const token = localStorage.getItem(ACCESS_TOKEN_KEY);
      const formData = { userId };

      const response = await fetch(
        `https://parkteletech-storage-backend.onrender.com/api/v1/files/soft/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Failed to delete file");

      toast.success("File deleted successfully!");
      setIsDeleteModalOpen(false);
      await refreshData();
    } catch (error) {
      toast.error("Failed to delete file");
      console.error("Error deleting file:", error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, delete: false }));
    }
  };

  const handleRenameFile = async () => {
    try {
      setLoadingStates((prev) => ({ ...prev, rename: true }));
      const token = localStorage.getItem(ACCESS_TOKEN_KEY);

      const response = await fetch(
        `https://parkteletech-storage-backend.onrender.com/api/v1/files/${id}/rename`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ newFileName }),
        }
      );

      if (!response.ok) throw new Error("Failed to rename file");

      toast.success("File renamed successfully!");
      setIsRenameModalOpen(false);
      await refreshData();
    } catch (error) {
      toast.error("Failed to rename file");
      console.error("Error renaming file:", error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, rename: false }));
    }
  };

  const handleDownload = () => {
    fetch(fileUrl as string)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.download = name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Error downloading file:", error);
        toast.error("Failed to download file");
      });
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

        <div className="absolute inset-0 rounded-lg bg-black bg-opacity-60 p-3 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 shadow-md">
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
                className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200"
              >
                <ul className="py-1">
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm flex items-center gap-2"
                    onClick={() => setIsRenameModalOpen(true)}
                  >
                    <Edit2Icon className="w-4 h-4" />
                    Rename
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm flex items-center gap-2"
                    onClick={handleDownload}
                  >
                    <FileIcon className="w-4 h-4" />
                    Download
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-red-600 flex items-center gap-2"
                    onClick={() => setIsDeleteModalOpen(true)}
                  >
                    <FileIcon className="w-4 h-4" />
                    Delete
                  </li>
                </ul>
              </div>
            )}
          </div>

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

      {isRenameModalOpen && (
        <RenameModal
          fileName={newFileName}
          isLoading={loadingStates.rename}
          onClose={() => setIsRenameModalOpen(false)}
          onRename={handleRenameFile}
          onChange={setNewFileName}
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
          Are you sure you want to trash{" "}
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

interface RenameModalProps {
  fileName: string;
  isLoading: boolean;
  onClose: () => void;
  onRename: () => void;
  onChange: (value: string) => void;
}

const RenameModal: React.FC<RenameModalProps> = ({
  fileName,
  isLoading,
  onClose,
  onRename,
  onChange,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-lg font-semibold mb-2">Rename File</h2>
        <input
          type="text"
          value={fileName}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          placeholder="Enter new file name"
          disabled={isLoading}
        />
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            onClick={onRename}
            disabled={isLoading}
          >
            {isLoading ? "Renaming..." : "Rename"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileCard;
