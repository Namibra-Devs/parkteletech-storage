import { FolderIcon, MoreVertical } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

interface DeleteFolderCardProps {
    id: number;
    name: string;
    fileCount: number;
    refreshTrashFolderData: () => Promise<void>;
  }
  
  const DeleteFolderCard: React.FC<DeleteFolderCardProps> = ({id, name, fileCount, refreshTrashFolderData}) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const token = localStorage.getItem("token");
  
  
    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  
    const openDeleteModal = () => {
      setIsDeleteModalOpen(true);
      setIsDropdownOpen(false);
    };
  
    const handleDeleteFolder = async () => {
      try {
        const response = await fetch(
          `https://www.parkteletechafrica.com/api/delete`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ ids: [id] }),
          }
        );
        if (!response.ok) {
          throw new Error("Failed to delete folder");
        }
        toast.success("Folder deleted successfully!");
        console.log("Delete folder:", id);
        setIsDeleteModalOpen(false);
        await refreshTrashFolderData();
      } catch (error) {
        toast.error("Failed to delete folder");
        console.error("Error deleting folder:", error);
      }
    };
  
    return (
      <div className="h-[40px] w-full items-center flex bg-white rounded-sm">
        <div className="bg-slate-100 h-full w-10 flex items-center justify-center">
          <FolderIcon className="fill-orange-300 text-orange-300" />
        </div>
        <div className="flex-1 flex p-2 items-center">
          <div className="flex-1">
            <Link to={`/folder/${id}`}>
              <p className="font-semibold text-[12px]">{name}</p>
              <p className="text-gray-600 text-[8px]">
                {fileCount ? fileCount : 0} files
              </p>
            </Link>
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

  export default DeleteFolderCard

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