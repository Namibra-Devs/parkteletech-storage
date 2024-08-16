// import { FolderIcon, MoreVertical } from "lucide-react";
// import { useState } from "react";
// import { Link } from "react-router-dom";

// interface FolderData {
//   id: number;
//   name: string;
// }

// interface FolderCardProps {
//   fileCount: number;
//   folder: FolderData;
//   onRename: (id: number, newName: string) => void;
//   onDelete: (id: number) => void;
// }

// const FolderCard: React.FC<FolderCardProps> = ({
//   fileCount,
//   folder,
//   onRename,
//   onDelete,
// }) => {
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

//   const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

//   const openRenameModal = () => {
//     setIsRenameModalOpen(true);
//     setIsDropdownOpen(false);
//   };

//   const openDeleteModal = () => {
//     setIsDeleteModalOpen(true);
//     setIsDropdownOpen(false);
//   };

//   const handleRename = async (newName: string) => {
//     await onRename(folder.id, newName);
//     setIsRenameModalOpen(false);
//   };

//   const handleDelete = async () => {
//     await onDelete(folder.id);
//     setIsDeleteModalOpen(false);
//   };

//   return (
//     <div className="h-[40px] w-full items-center flex bg-white rounded-sm">
//       <div className="bg-slate-100 h-full w-10 flex items-center justify-center">
//         <FolderIcon className="fill-orange-300 text-orange-300" />
//       </div>
//       <div className="flex-1 flex p-2 items-center">
//         <div className="flex-1">
//           <Link to={`/folder/${folder.id}`}>
//             <p className="font-semibold text-[12px]">{folder.name}</p>
//             <p className="text-gray-600 text-[8px]">
//               {fileCount ? fileCount : 0} files
//             </p>
//           </Link>
//         </div>
//         <div className="relative">
//           <MoreVertical
//             className="cursor-pointer ml-7"
//             onClick={toggleDropdown}
//           />
//           {isDropdownOpen && (
//             <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10">
//               <ul className="py-1">
//                 <li
//                   className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                   onClick={openRenameModal}
//                 >
//                   Rename
//                 </li>
//                 <li
//                   className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                   onClick={openDeleteModal}
//                 >
//                   Delete
//                 </li>
//               </ul>
//             </div>
//           )}
//         </div>
//       </div>

//       {isRenameModalOpen && (
//         <RenameModal
//           onClose={() => setIsRenameModalOpen(false)}
//           onRename={handleRename}
//           currentName={folder.name}
//         />
//       )}
//       {isDeleteModalOpen && (
//         <DeleteModal
//           onClose={() => setIsDeleteModalOpen(false)}
//           onDelete={handleDelete}
//         />
//       )}
//     </div>
//   );
// };

// interface RenameModalProps {
//   onClose: () => void;
//   onRename: (newName: string) => void;
//   currentName: string;
// }

// const RenameModal: React.FC<RenameModalProps> = ({
//   onClose,
//   onRename,
//   currentName,
// }) => {
//   const [newName, setNewName] = useState(currentName);

//   const handleRename = () => {
//     onRename(newName);
//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white p-6 rounded-md">
//         <h2 className="text-lg font-semibold mb-4">Rename Folder</h2>
//         <input
//           type="text"
//           className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
//           placeholder="New folder name"
//           value={newName}
//           onChange={(e) => setNewName(e.target.value)}
//         />
//         <div className="flex justify-end">
//           <button
//             className="px-4 py-2 bg-blue-500 text-white rounded-md mr-2"
//             onClick={handleRename}
//           >
//             Rename
//           </button>
//           <button
//             className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
//             onClick={onClose}
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// interface DeleteModalProps {
//   onClose: () => void;
//   onDelete: () => void;
// }

// const DeleteModal: React.FC<DeleteModalProps> = ({ onClose, onDelete }) => {
//   const handleDelete = () => {
//     onDelete();
//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white p-6 rounded-md">
//         <h2 className="text-lg font-semibold mb-4">Delete Folder</h2>
//         <p className="mb-4">Are you sure you want to delete this folder?</p>
//         <div className="flex justify-end">
//           <button
//             className="px-4 py-2 bg-red-500 text-white rounded-md mr-2"
//             onClick={handleDelete}
//           >
//             Delete
//           </button>
//           <button
//             className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
//             onClick={onClose}
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FolderCard;

import { FolderIcon, MoreVertical } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

interface FolderCardProps {
  id: number;
  name: string;
  fileCount: number;
  refreshFolderData: () => Promise<void>;
}

const FolderCard: React.FC<FolderCardProps> = ({
  id,
  name,
  fileCount,
  refreshFolderData,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const token = localStorage.getItem("token");

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const openRenameModal = () => {
    setIsRenameModalOpen(true);
    setIsDropdownOpen(false);
  };

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
    setIsDropdownOpen(false);
  };

  const handleRenameFolder = async (newName: string) => {
    try {
      const response = await fetch(
        `https://www.parkteletechafrica.com/api/folders/${id}/rename`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ name: newName }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to rename folder");
      }
      await refreshFolderData();
      toast.success("Folder renamed successfully!");
      console.log("Rename folder:", id, newName);
      setIsRenameModalOpen(false);
    } catch (error) {
      console.error("Error renaming folder:", error);
      toast.error("Failed to rename folder");
    }
  };

  const handleDeleteFolder = async () => {
    try {
      const formData = {
        ids: [id]
      }

      const userId = localStorage.getItem("userId");
      const response = await fetch(
        `https://www.parkteletechafrica.com/api/delete?user_id=${userId}`,
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
      console.log("Delete folder:", id);
      setIsDeleteModalOpen(false);
      await refreshFolderData();
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
                  onClick={openRenameModal}
                >
                  Rename
                </li>
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

      {isRenameModalOpen && (
        <RenameModal
          onClose={() => setIsRenameModalOpen(false)}
          onRename={handleRenameFolder}
          currentName={name}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteModal
          onClose={() => setIsDeleteModalOpen(false)}
          onDelete={handleDeleteFolder}
        />
      )}
    </div>
  );
};

interface RenameModalProps {
  onClose: () => void;
  onRename: (newName: string) => void;
  currentName: string;
}

const RenameModal: React.FC<RenameModalProps> = ({
  onClose,
  onRename,
  currentName,
}) => {
  const [newName, setNewName] = useState(currentName);

  const handleRename = () => {
    onRename(newName);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md">
        <h2 className="text-lg font-semibold mb-4">Rename Folder</h2>
        <input
          type="text"
          className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
          placeholder="New folder name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <div className="flex justify-end">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md mr-2"
            onClick={handleRename}
          >
            Rename
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



export default FolderCard