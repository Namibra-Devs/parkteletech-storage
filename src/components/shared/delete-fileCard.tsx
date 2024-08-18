import React, { useState } from "react";
import { FileIcon, MoreVertical, Music4Icon } from "lucide-react";
import { toast } from "react-toastify";

interface FileCardProps {
  id: number;
  name: string;
  size: number | null;
  refreshFileData: () => Promise<void>;
  refreshTrashFileData: () => Promise<void>;
}
const DeleteFileCard: React.FC<FileCardProps> = ({id, name, size, refreshFileData, refreshTrashFileData}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);


  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
    setIsDropdownOpen(false);
  };

  const handleDeleteFolder = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");
      const formData = {
        ids: [id],
        user_id: userId,
      }

      const response = await fetch(
        `https://www.parkteletechafrica.com/api/files/permanently-delete`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete folder");
      }
      toast.success("Folder deleted successfully!");
      setIsDeleteModalOpen(false);
      await refreshFileData();
      await refreshTrashFileData();
    } catch (error) {
      toast.error("Failed to delete folder");
      console.error("Error deleting folder:", error);
    }
  };
  return (
    <div className="flex flex-col bg-white w-[165px] items-center rounded-sm">
            <div className="w-40 h-40 bg-gray-300 rounded-sm">
              {name.endsWith(".png") || name.endsWith(".jpg") || name.endsWith(".jpeg") ? (
                <img
                  src={`https://images.pexels.com/photos/547114/pexels-photo-547114.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2`}
                  alt={name}
                  className="rounded-sm object-cover w-full h-full"
                />
              ) : (
                <i className="flex justify-center mt-16">
                  {name.endsWith(".mp3") ? <Music4Icon /> : <FileIcon />}
                </i>
              )}
            </div>
            <div className="mt-2 flex flex-row items-center">
              <div className="flex flex-col">
              <p className="text-sm font-semibold">{name}</p>
              <p className="text-xs font-medium text-gray-400">
                {size ? `${size} bytes` : "Unknown size"}
              </p>
              </div>
              <div className="relative">
                <MoreVertical
                  className="cursor-pointer ml-7"
                  onClick={toggleDropdown}
                />
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10">
                    <ul className="py-1">
                      <li
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={openDeleteModal}
                      >
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
              />
            )}
          </div>
  );
};

interface DeleteModalProps {
  onClose: () => void;
  onDelete: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ onClose, onDelete }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md">
        <h2 className="text-lg font-semibold mb-4">Delete Folder</h2>
        <p className="mb-4">Are you sure you want to delete this folder?</p>
        <div className="flex justify-end">
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-md mr-2"
            onClick={onDelete}
          >
            Delete
          </button>
          <button
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteFileCard;
