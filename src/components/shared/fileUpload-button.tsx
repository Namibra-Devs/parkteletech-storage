// import { CloudUploadIcon } from "lucide-react";
// import { useState } from "react";
// import { toast } from "react-toastify";

// interface FileUploadProps {
//   folderId: number;
//   refreshFileData: () => Promise<void>;
// }

// export default function FileUpload({ folderId, refreshFileData }: FileUploadProps) {
//   const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
//   const userId = localStorage.getItem("userId");
  
//   const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (files) {
//       setSelectedFiles(files);
//     }
//   };

//   const handleUpload = async () => {
//     try {
//       const formData = {
//         folder_id: folderId ? folderId : null,
//         "files[]": selectedFiles,
//       };

//         await fetch(`https://www.parkteletechafrica.com/api/files?user_id=${userId}`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "multipart/form-data",
//             "Authorization": `Bearer ${localStorage.getItem("token")}`,
//           },
//           body: JSON.stringify(formData),
//         });
//         toast.success("Files uploaded successfully");
//         await refreshFileData();
//         setSelectedFiles(null);
//     } catch (error) {
//       toast.error("Failed to upload files");
//       console.log(error);
//     }
//   };

//   return (
//     <div className="flex items-center space-x-2">
//       <label
//         htmlFor="file-upload"
//         className="inline-flex cursor-pointer items-center rounded-md bg-transparent px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-blue-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-offset-2 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200 dark:focus:ring-gray-300 dark:focus:ring-offset-gray-950 border border-gray-200"
//       >
//         <CloudUploadIcon className="mr-2 h-5 w-5" />
//         <p className="hidden lg:block">Upload File</p>
//       </label>
//       <input id="file-upload" type="file" onChange={handleFileUpload} multiple className="sr-only" />
//     </div>
//   );
// }


import { CloudUploadIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

interface FileUploadProps {
  folderId: number | null;
  refreshFileData: () => Promise<void>;
}

export default function FileUpload({ folderId, refreshFileData }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const userId = localStorage.getItem("userId");
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('folder_id', folderId ? folderId.toString() : '');
      for (let i = 0; i < files.length; i++) {
        formData.append('files[]', files[i]);
      }

      const response = await fetch(`https://www.parkteletechafrica.com/api/files?user_id=${userId}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      toast.success("Files uploaded successfully");
      await refreshFileData();
    } catch (error) {
      toast.error("Failed to upload files");
      console.error(error);
    } finally {
      setIsUploading(false);
      e.target.value = ''; // Reset the file input
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <label
        htmlFor="file-upload"
        className={`inline-flex cursor-pointer items-center rounded-md bg-transparent px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-blue-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-offset-2 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200 dark:focus:ring-gray-300 dark:focus:ring-offset-gray-950 border border-gray-200 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <CloudUploadIcon className="mr-2 h-5 w-5" />
        <p className="hidden lg:block">{isUploading ? 'Uploading...' : 'Upload File'}</p>
      </label>
      <input 
        id="file-upload" 
        type="file" 
        onChange={handleFileUpload} 
        multiple 
        className="sr-only" 
        disabled={isUploading}
      />
    </div>
  );
}