import { ACCESS_TOKEN_KEY } from "@/constants";
import {
  FolderIcon,
  MoreVertical,
  Loader2,
  PinIcon,
  Edit2Icon,
  Trash2Icon,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

interface FolderCardProps {
  id: number;
  name: string;
  fileCount: number;
  lastModified?: string;
  totalSize?: number;
  isPinned?: boolean;
  isHome?: boolean;
  refreshFolderData: () => Promise<void>;
  refreshTrashFolders: () => Promise<void>;
}

const FolderCard: React.FC<FolderCardProps> = ({
  id,
  name,
  fileCount,
  lastModified,
  isPinned,
  totalSize,
  isHome = false,
  refreshFolderData,
  refreshTrashFolders,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState({
    delete: false,
    rename: false,
    pin: false,
    unpin: false,
  });

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

  const openRenameModal = () => {
    setIsRenameModalOpen(true);
    setIsDropdownOpen(false);
  };

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
    setIsDropdownOpen(false);
  };

  const baseUrl = "https://storage-api.parkteletechafrica.com/api/v1/folders";

  const handleRenameFolder = async (newName: string) => {
    setIsLoading((prev) => ({ ...prev, rename: true }));
    try {
      const response = await fetch(`${baseUrl}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newName }),
      });
      if (!response.ok) {
        throw new Error("Failed to rename folder");
      }
      await refreshFolderData();
      toast.success("Folder renamed successfully!");
      setIsRenameModalOpen(false);
    } catch (error) {
      console.error("Error renaming folder:", error);
      toast.error("Failed to rename folder");
    } finally {
      setIsLoading((prev) => ({ ...prev, rename: false }));
    }
  };

  const handleDeleteFolder = async () => {
    setIsLoading((prev) => ({ ...prev, delete: true }));
    try {
      const response = await fetch(`/soft-delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete folder");
      }
      setIsDeleteModalOpen(false);
      await refreshFolderData();
      await refreshTrashFolders();
      toast.success("Folder deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete folder");
      console.error("Error deleting folder:", error);
    } finally {
      setIsLoading((prev) => ({ ...prev, delete: false }));
    }
  };

  const handlePinFolder = async () => {
    setIsLoading((prev) => ({ ...prev, pin: true }));
    try {
      const response = await fetch(`${baseUrl}/pin/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to pin folder");
      }
      await refreshFolderData();
      toast.success("Folder pinned successfully!");
    } catch (error) {
      toast.error("Failed to pin folder");
      console.error("Error pinning folder:", error);
    } finally {
      setIsLoading((prev) => ({ ...prev, pin: false }));
      setIsDropdownOpen(false);
    }
  };

  const handleUnpinFolder = async () => {
    setIsLoading((prev) => ({ ...prev, unpin: true }));
    try {
      const response = await fetch(`${baseUrl}/unpin/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to unpin folder");
      }
      await refreshFolderData();
      toast.success("Folder unpinned successfully!");
    } catch (error) {
      toast.error("Failed to unpin folder");
      console.error("Error unpinning folder:", error);
    } finally {
      setIsLoading((prev) => ({ ...prev, unpin: false }));
      setIsDropdownOpen(false);
    }
  };

  return (
    <div className="h-auto min-h-[60px] w-full flex flex-col bg-white rounded-md shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center p-3">
        <div className="bg-slate-100 h-10 w-10 flex items-center justify-center rounded-md">
          <FolderIcon className="fill-orange-300 text-orange-300" />
        </div>
        <div className="flex-1 ml-3">
          <Link to={`/folder/${id}`} className="hover:text-blue-600">
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
          </Link>
        </div>
        <div className="relative ml-2" ref={dropdownRef}>
          <button
            onClick={toggleDropdown}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <MoreVertical className="h-5 w-5 text-gray-500" />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10 border border-gray-200">
              <ul className="py-1">
                <li
                  className="px-4 py-2 hover:bg-gray-100 gap-2 cursor-pointer text-sm flex items-center"
                  onClick={openRenameModal}
                >
                  {isLoading.rename ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : null}
                  <Edit2Icon className="w-4 h-4" /> Rename
                </li>
                {isHome ? (
                  <>
                    {isPinned ? (
                      <li
                        className="px-4 py-2 hover:bg-gray-100 gap-2 cursor-pointer text-sm flex items-center"
                        onClick={handleUnpinFolder}
                      >
                        {isLoading.unpin ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : null}
                        <PinIcon className="w-4 h-4" /> Unpin
                      </li>
                    ) : (
                      <li
                        className="px-4 py-2 hover:bg-gray-100 gap-2 cursor-pointer text-sm flex items-center"
                        onClick={handlePinFolder}
                      >
                        {isLoading.pin ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : null}
                        <PinIcon className="w-4 h-4" /> Pin Folder
                      </li>
                    )}
                  </>
                ) : null}
                <li
                  className="px-4 py-2 hover:bg-gray-100 gap-2 cursor-pointer text-sm text-red-600 flex items-center"
                  onClick={openDeleteModal}
                >
                  {isLoading.delete ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : null}
                  <Trash2Icon className="w-4 h-4" /> Delete
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {isRenameModalOpen && (
        <RenameModal
          onClose={() => setIsRenameModalOpen(false)}
          onRename={handleRenameFolder}
          currentName={name}
          isLoading={isLoading.rename}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteModal
          onClose={() => setIsDeleteModalOpen(false)}
          onDelete={handleDeleteFolder}
          isLoading={isLoading.delete}
        />
      )}
    </div>
  );
};

interface RenameModalProps {
  onClose: () => void;
  onRename: (newName: string) => void;
  currentName: string;
  isLoading: boolean;
}

const RenameModal: React.FC<RenameModalProps> = ({
  onClose,
  onRename,
  currentName,
  isLoading,
}) => {
  const [newName, setNewName] = useState(currentName);

  const handleRename = () => {
    onRename(newName);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Rename Folder</h2>
        <input
          type="text"
          className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="New folder name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          disabled={isLoading}
        />
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 flex items-center"
            onClick={handleRename}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Rename
          </button>
        </div>
      </div>
    </div>
  );
};

interface DeleteModalProps {
  onClose: () => void;
  onDelete: () => void;
  isLoading: boolean;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  onClose,
  onDelete,
  isLoading,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Delete Folder</h2>
        <p className="mb-4 text-gray-600">
          Are you sure you want to delete this folder? This action cannot be
          undone.
        </p>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50 flex items-center"
            onClick={onDelete}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default FolderCard;
